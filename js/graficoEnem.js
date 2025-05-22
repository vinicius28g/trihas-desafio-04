let enemMaChart = null;

async function criarGraficoEnem() {
  const divCarregando = document.getElementById('carregamento-enem');
  const divErro = document.getElementById('erro-enem');
  const divGrafico = document.getElementById('enemMaChart');

  // Mostrar carregando, esconder erro e gráfico
  divCarregando.style.display = 'block';
  divErro.style.display = 'none';
  divGrafico.style.display = 'none';

  try {
    if (enemMaChart) enemMaChart.destroy();

    const dados = await dadosCidadeEnem();
    console.log("Dados ENEM:", dados.mediasEnem);

    // Pega ano, cidade e estado
    const ano = document.getElementById('select_ano').value;

    const cidadeSelect = document.getElementById('cidade');
    const estadoSelect = document.getElementById('estado');

    const nomeCidade = cidadeSelect.value !== ''
      ? cidadeSelect.options[cidadeSelect.selectedIndex].text
      : 'São Luís';

    const nomeEstado = estadoSelect.value !== ''
      ? estadoSelect.options[estadoSelect.selectedIndex].text
      : 'MA';

    enemMaChart = Highcharts.chart('enemMaChart', {
      chart: { type: 'column' },
      title: { 
        text: `Médias do ENEM ${ano} - ${nomeCidade} , ${nomeEstado}`,
        style: { fontSize: '16px' }
      },
      xAxis: {
        categories: [
          'Linguagens',
          'Matemática',
          'Ciências Humanas',
          'Ciências da Natureza',
          'Redação',
          'Geral'
        ],
        crosshair: true
      },
      yAxis: {
        min: 0,
        max: 1000,
        title: { text: 'Nota (0 a 1000)' }
      },
      tooltip: { shared: true },
      series: [{
        name: 'Média ENEM',
        data: dados.mediasEnem.map(n => parseFloat(n)),
        color: '#007bff'
      }],
      credits: { enabled: false }
    });

    divCarregando.style.display = 'none';
    divErro.style.display = 'none';
    divGrafico.style.display = 'block';

  } catch (erro) {
    console.error("Erro ao gerar gráfico ENEM:", erro);
    divCarregando.style.display = 'none';
    divErro.style.display = 'block';
    divGrafico.style.display = 'none';
  }
}

