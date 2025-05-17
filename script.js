
const tokenQEDU = 'Nb4YrEby5vHE4F9JjMu5ihyTYtiEOM0T0isMqHAM';  

// retorna os dados do IDEB relacionados ao estado ou cidade selecionada
async function dadosIdeb() {
    let codigoInep = $('#cidade').val()? $('#cidade').val() : $('#estado').val();
    const categorias = [];
    const idebObtido = [];
    const idebEsperado = [];
    const anosDesejados = [2011, 2013, 2015, 2017, 2019];
    for (const ano of anosDesejados) {
      const url = `https://api.qedu.org.br/v1/ideb?id=${codigoInep}&ano=${ano}`;

      try {
        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${tokenQEDU}`
          }
        });

        const json = await response.json();

        if (json.data && Array.isArray(json.data)) {

          let somaIdeb = 0;
          let somaProjetado = 0;
          let total = 0;

          for (const ciclo of json.data) {
            const ideb = parseFloat(ciclo.ideb);
            const projetado = parseFloat(ciclo.ideb_projetado);

            if (!isNaN(ideb)) {
              somaIdeb += ideb;
              total++;
            }
            if (!isNaN(projetado)) somaProjetado += projetado;
          }

          const mediaIdeb = total > 0 ? (somaIdeb / total).toFixed(2) : null;
          const mediaProjetado = total > 0 ? (somaProjetado / total).toFixed(2) : null;

          categorias.push(ano.toString());
          idebObtido.push(mediaIdeb ? parseFloat(mediaIdeb) : null);
          idebEsperado.push(mediaProjetado ? parseFloat(mediaProjetado) : null);
        }

      } catch (err) {
        console.error(`Erro ao buscar dados para ${ano}:`, err);
      }
    }
    return { idebObtido, idebEsperado, categorias };

}

async function dadosIdebEstado() {
  const estadoMap = new Map();
  const retornoMap = new Map();
  const ano = 2019;

  // 1. Buscar os estados do IBGE
  const res = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome');
  const estados = await res.json();

  estados.forEach(estado => {
    estadoMap.set(estado.sigla, estado.id);
  });

  for (const [estado, codigoInep] of estadoMap.entries()) {
    const url = `https://api.qedu.org.br/v1/ideb?id=${codigoInep}&ano=${ano}`;

    try {
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${tokenQEDU}`
        }
      });

      const json = await response.json();

      if (json.data && Array.isArray(json.data)) {
        let somaIdeb = 0;
        let total = 0;

        for (const ciclo of json.data) {
          const ideb = parseFloat(ciclo.ideb);
          if (!isNaN(ideb)) {
            somaIdeb += ideb;
            total++;
          }
        }

        const mediaIdeb = total > 0 ? (somaIdeb / total).toFixed(2) : null;
        retornoMap.set(estado.toLowerCase(), mediaIdeb);
      }

    } catch (err) {
      console.error(`Erro ao buscar dados para ${estado} (${ano}):`, err);
    }
  }
  return retornoMap;
}
dadosIdebEstado();

