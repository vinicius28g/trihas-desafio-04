const estadoSelect = document.getElementById('estado');
const cidadeSelect = document.getElementById('cidade');

// Carrega os estados do Brasil
fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome')
  .then(res => res.json())
  .then(estados => {
    let maranhaoId = null;

    estados.forEach(estado => {
      const opt = document.createElement('option');
      opt.value = estado.id;
      opt.textContent = estado.nome;

      if (estado.sigla === 'MA') {
        opt.selected = true; 
        maranhaoId = estado.id;
      }

      estadoSelect.appendChild(opt);
    });

   
    if (maranhaoId) {
      carregarCidades(maranhaoId);
    }
  });


function carregarCidades(estadoId) {
  cidadeSelect.innerHTML = '<option value="">Carregando...</option>';

  fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estadoId}/municipios`)
    .then(res => res.json())
    .then(cidades => {
      cidadeSelect.innerHTML = '<option value="">Selecione uma cidade</option>';
      cidades.forEach(cidade => {
        const opt = document.createElement('option');
        opt.value = cidade.id;
        opt.textContent = cidade.nome;
        cidadeSelect.appendChild(opt);
      });
    });
}

// Quando um estado for selecionado, carrega as cidades
estadoSelect.addEventListener('change', () => {
  const estadoId = estadoSelect.value;
  if (estadoId) {
    carregarCidades(estadoId);
  }
});

const tokenQEDU = 'Nb4YrEby5vHE4F9JjMu5ihyTYtiEOM0T0isMqHAM';  

// retorna os dados do IDEB relacionados ao estado ou cidade selecionada
async function dadosIdeb() {
  const carregando = document.getElementById('carregamento-ideb');
  const erro = document.getElementById('erro-ideb');
  const chartContainer = document.getElementById('idebChart');

  carregando.style.display = 'block';
  erro.style.display = 'none';
  chartContainer.innerHTML = '';

  let codigoInep = document.getElementById('cidade').value 
    ? document.getElementById('cidade').value 
    : document.getElementById('estado').value;

  const categorias = [];
  const idebObtido = [];
  const idebEsperado = [];
  const anosDesejados = [2011, 2013, 2015, 2017, 2019];

  try {
    for (const ano of anosDesejados) {
      const url = `https://api.qedu.org.br/v1/ideb?id=${codigoInep}&ano=${ano}`;

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${tokenQEDU}`
        }
      });

      if (!response.ok) {
        throw new Error(`Erro HTTP ${response.status} ao buscar dados do ano ${ano}`);
      }

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
          if (!isNaN(projetado)) {
            somaProjetado += projetado;
          }
        }

        const mediaIdeb = total > 0 ? (somaIdeb / total).toFixed(2) : null;
        const mediaProjetado = total > 0 ? (somaProjetado / total).toFixed(2) : null;

        categorias.push(ano.toString());
        idebObtido.push(mediaIdeb ? parseFloat(mediaIdeb) : null);
        idebEsperado.push(mediaProjetado ? parseFloat(mediaProjetado) : null);
      } else {
        throw new Error(`Resposta inválida para o ano ${ano}`);
      }
    }

    // Validação geral após o loop
    if (categorias.length === 0 || idebObtido.length === 0 || idebEsperado.length === 0) {
      throw new Error('Dados insuficientes retornados da API');
    }

    return { idebObtido, idebEsperado, categorias };

  } catch (err) {
    console.error('Erro ao buscar dados IDEB:', err);
    carregando.style.display = 'none';
    erro.style.display = 'block';
    chartContainer.innerHTML = '';
    throw err; // Deixa o createIdebChart lidar com isso também, se necessário
  } finally {
    carregando.style.display = 'none';
  }
}

async function dadosIdebEstado() {
  const erroDiv = document.getElementById('erro-idebEstado');
  const carregandoDiv = document.getElementById('carregamento-idebEstado');

  // Exibe "Carregando", oculta "Erro"
  erroDiv.style.display = 'none';
  carregandoDiv.style.display = 'block';

  const estadoMap = new Map();
  const retornoMap = new Map();
  const ano = document.getElementById('select_ano').value || 2019;

  try {
    // Buscar os estados do IBGE
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
      } catch (erroInterno) {
        console.warn(`Erro parcial no estado ${estado}:`, erroInterno);
      }
    }

    // Oculta "Carregando"
    carregandoDiv.style.display = 'none';

    // Se nenhum dado foi coletado, mostra erro
    if (retornoMap.size === 0) {
      erroDiv.style.display = 'block';
    }

    return retornoMap;

  } catch (erroGeral) {
    console.error('Erro geral na busca de dados IDEB:', erroGeral);
    carregandoDiv.style.display = 'none';
    erroDiv.style.display = 'block';
    return new Map(); // Retorna mapa vazio em caso de erro
  }
}

async function dadosCidadeEnem() {
  const carregando = document.getElementById('carregamento-enem');
  const erro = document.getElementById('erro-enem');
  const chartContainer = document.getElementById('enemMaChart');

  // Exibir carregando, esconder erro e gráfico
  carregando.style.display = 'block';
  erro.style.display = 'none';
  chartContainer.innerHTML = '';

  let cidade = document.getElementById('cidade').value;
  let codigoInep = cidade != '' ? cidade : 2111300; // São Luís
  const mediasEnem = [];

  const ano = document.getElementById('select_ano').value || 2019;

  const url = `https://api.qedu.org.br/v1/enem?id=${codigoInep}&ano=${ano}`;

  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${tokenQEDU}`
      }
    });

    const json = await response.json();

    if (json.data && Array.isArray(json.data)) {
      let somaLc = 0;
      let somaMt = 0;
      let somaCh = 0;
      let somaCn = 0;
      let somaRedacao = 0;
      let somaMeiaGeral = 0;
      let total = 0;

      for (const escola of json.data) {
        const media_Lc = parseFloat(escola.media_LC);
        const media_MT = parseFloat(escola.media_MT);
        const media_CH = parseFloat(escola.media_CH);
        const media_CN = parseFloat(escola.media_CN);
        const media_redacao = parseFloat(escola.media_redacao);
        const media_geral = parseFloat(escola.media_geral);

        if (!isNaN(media_Lc)) {
          somaLc += media_Lc;
          total++;
        }
        if (!isNaN(media_MT)) somaMt += media_MT;
        if (!isNaN(media_CH)) somaCh += media_CH;
        if (!isNaN(media_CN)) somaCn += media_CN;
        if (!isNaN(media_redacao)) somaRedacao += media_redacao;
        if (!isNaN(media_geral)) somaMeiaGeral += media_geral;
      }

      const media_Lc = total > 0 ? (somaLc / total).toFixed(2) : null;
      const media_MT = total > 0 ? (somaMt / total).toFixed(2) : null;
      const media_CH = total > 0 ? (somaCh / total).toFixed(2) : null;
      const media_CN = total > 0 ? (somaCn / total).toFixed(2) : null;
      const media_redacao = total > 0 ? (somaRedacao / total).toFixed(2) : null;
      const media_geral = total > 0 ? (somaMeiaGeral / total).toFixed(2) : null;

      mediasEnem.push(media_Lc);
      mediasEnem.push(media_MT);
      mediasEnem.push(media_CH);
      mediasEnem.push(media_CN);
      mediasEnem.push(media_redacao);
      mediasEnem.push(media_geral);

     // console.log('mediasEnem: ', mediasEnem);
    } else {
      throw new Error('Dados inválidos ou ausentes');
    }
  } catch (err) {
    console.error(`Erro ao buscar dados para ${ano}:`, err);
    erro.style.display = 'block';
  } finally {
    carregando.style.display = 'none';
  }

  return { mediasEnem };
}


async function dadosInse() {
  
    let cidade= document.getElementById('cidade').value; 
    let estado= document.getElementById('estado').value;
    estado = estado != ''? estado : 21; // Maranhão
   
  
  
    const mediasInse = [];
    let mediaInse_absoluto = 0;
    let mediaClassificacao = 0;

    let url = ''
    let ano = document.getElementById('select_ano').value || 2019;
    ano = parseInt(ano);
    if(cidade.trim() != ''){
      cidade = parseInt(cidade);
      url = `https://api.qedu.org.br/v1/inse_escolas?cidade_id=${cidade}&ano=${ano}`;
    }else{
      estado = parseInt(estado);
      url = `https://api.qedu.org.br/v1/inse_escolas?estado_id=${estado}&ano=${ano}`;
    }
      try {
        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${tokenQEDU}`
          }
        });

        const json = await response.json();

        if (json.data && Array.isArray(json.data)) {

          let somaInse_absoluto = 0;
          let somaClassificacao = 0;
          let somaNivel_1 = 0;
          let somaNivel_2 = 0;
          let somaNivel_3 = 0;
          let somaNivel_4 = 0;
          let somaNivel_5 = 0;
          let somaNivel_6 = 0;
          let somaNivel_7 = 0;
          let somaNivel_8 = 0;

          let total = 0;

          for (const dado of json.data) {
            const inse_absoluto = parseFloat(dado.inse_absoluto);
            const classificacao = parseFloat(dado.classificacao);
            const nivel_1 = parseFloat(dado.nivel_1);
            const nivel_2 = parseFloat(dado.nivel_2);
            const nivel_3 = parseFloat(dado.nivel_3); 
            const nivel_4 = parseFloat(dado.nivel_4);
            const nivel_5 = parseFloat(dado.nivel_5);
            const nivel_6 = parseFloat(dado.nivel_6);
            const nivel_7 = parseFloat(dado.nivel_7);
            const nivel_8 = parseFloat(dado.nivel_8);
            

            if (!isNaN(inse_absoluto)) {
              somaInse_absoluto += inse_absoluto;
              total++;
            }
            if (!isNaN(classificacao)) somaClassificacao += classificacao;
            if (!isNaN(nivel_1)) somaNivel_1 += nivel_1;
            if (!isNaN(nivel_2)) somaNivel_2 += nivel_2;
            if (!isNaN(nivel_3)) somaNivel_3 += nivel_3;
            if (!isNaN(nivel_4)) somaNivel_4 += nivel_4;
            if (!isNaN(nivel_5)) somaNivel_5 += nivel_5;
            if (!isNaN(nivel_6)) somaNivel_6 += nivel_6;
            if (!isNaN(nivel_7)) somaNivel_7 += nivel_7;
            if (!isNaN(nivel_8)) somaNivel_8 += nivel_8;
           
            
          }

          mediaInse_absoluto = total > 0 ? (somaInse_absoluto / total).toFixed(2) : null;
          mediaClassificacao = total > 0 ? (somaClassificacao / total).toFixed(2) : null;
          const mediaNivel_1 = total > 0 ? (somaNivel_1 / total).toFixed(2) : null;
          const mediaNivel_2 = total > 0 ? (somaNivel_2 / total).toFixed(2) : null;
          const mediaNivel_3 = total > 0 ? (somaNivel_3 / total).toFixed(2) : null;
          const mediaNivel_4 = total > 0 ? (somaNivel_4 / total).toFixed(2) : null;
          const mediaNivel_5 = total > 0 ? (somaNivel_5 / total).toFixed(2) : null;
          const mediaNivel_6 = total > 0 ? (somaNivel_6 / total).toFixed(2) : null;
          const mediaNivel_7 = total > 0 ? (somaNivel_7 / total).toFixed(2) : null;
          const mediaNivel_8 = total > 0 ? (somaNivel_8 / total).toFixed(2) : null;

          mediasInse.push(mediaNivel_1);
          mediasInse.push(mediaNivel_2);
          mediasInse.push(mediaNivel_3);
          mediasInse.push(mediaNivel_4);
          mediasInse.push(mediaNivel_5);
          mediasInse.push(mediaNivel_6);
          mediasInse.push(mediaNivel_7);
          mediasInse.push(mediaNivel_8);

          //console.log(mediasInse);
          //console.log("mediaInse_absoluto: ", mediaInse_absoluto);
          //console.log('mediaClassificacao: ', mediaClassificacao);
         
        }

      } catch (err) {
        console.error(`Erro ao buscar dados inse:`, err);
      }
    
    return {mediasInse, mediaInse_absoluto, mediaClassificacao};

}

async function dadosInfraestruturaEscolar() {
    let cidade= document.getElementById('cidade').value; 
    let estado= document.getElementById('estado').value || 21; // Maranhão
    let codigoInep = cidade!= ''? cidade : estado 
    let redeEnsino = document.getElementById('select_rede_ensino').value || 0 // nem uma;
    const mapDependencias = new Map();

    const ano = document.getElementById('select_ano').value || 2019;
    
      const url = `https://api.qedu.org.br/v1/censo/territorio?id=${codigoInep}&ano=${ano}`;
      if(redeEnsino != 0){
        url += `&dependencia_id=${redeEnsino}`;
      }

      try {
        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${tokenQEDU}`
          }
        });

        const json = await response.json();

        if (json.data && Array.isArray(json.data)) {

          let quantEscola = 0;
          let quantBiblioteca = 0;
          let quantAguaFiltrada = 0;
          let quantAtendimentoEspecial = 0;
          let quantInternet = 0;
          let quantBandaLarga = 0;
          let quantAcessibilidade = 0;
          
          for (const ciclo of json.data) {
            quantEscola += Number(ciclo.qtd_escolas) || 0;
            quantBiblioteca += Number(ciclo.dependencias_biblioteca) || 0;
            quantAguaFiltrada += Number(ciclo.alimentacao_agua_filtrada) || 0;
            quantAtendimentoEspecial += Number(ciclo.dependencias_sala_atendimento_especial) || 0;
            quantInternet += Number(ciclo.tecnologia_internet) || 0;
            quantBandaLarga += Number(ciclo.tecnologia_banda_larga) || 0;
            quantAcessibilidade += Number(ciclo.acessibilidade_escola) || 0;
            
          }
          //console.log('quantBandaLarga: ', quantBandaLarga)

        const porcentagemBiblioteca = ((quantBiblioteca/quantEscola) * 100).toFixed(2);
        const porcentagemAguaFiltrada = ((quantAguaFiltrada/quantEscola) * 100).toFixed(2);
        const porcentagemAtendimentoEspecial = ((quantAtendimentoEspecial/quantEscola) * 100).toFixed(2);
        const porcentagemInternet = ((quantInternet/quantEscola) * 100).toFixed(2);
        const porcentagemBandaLarga = ((quantBandaLarga/quantEscola) * 100).toFixed(2);
        const porcentagemAcessibilidade = ((quantAcessibilidade/quantEscola) * 100).toFixed(2);

        mapDependencias.set('quantEscola', [quantEscola]);
        mapDependencias.set('quantBiblioteca', [quantBiblioteca, porcentagemBiblioteca]);
        mapDependencias.set('quantAguaFiltrada', [quantAguaFiltrada, porcentagemAguaFiltrada]);
        mapDependencias.set('quantAtendimentoEspecial', [quantAtendimentoEspecial, porcentagemAtendimentoEspecial]);
        mapDependencias.set('quantInternet', [quantInternet, porcentagemInternet]);
        mapDependencias.set('quantBandaLarga', [quantBandaLarga, porcentagemBandaLarga]);
        mapDependencias.set('quantAcessibilidade', [quantAcessibilidade, porcentagemAcessibilidade]);
        
        //console.log('mapDependencias: ', mapDependencias);
        }

      } catch (err) {
        console.error(`Erro ao buscar dados para ${ano}:`, err);
      }
    
     return mapDependencias;
    
    }
    let mapaBrasilChart;

function criarMapaEnemBrasil(dados) {
  if (mapaBrasilChart) mapaBrasilChart.destroy();

  mapaBrasilChart = Highcharts.mapChart('mapaBrasil', {
    chart: { map: 'countries/br/br-all' },
    title: { text: '' },
    series: [{
      name: 'IDEB Médio',
      data: dados,
      color: '#6366f1',
      dataLabels: {
        enabled: true,
        format: '{point.name}'
      }
    }],
    credits: { enabled: false }
  });
}










