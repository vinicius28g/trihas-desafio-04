let idebChart;

async function createIdebChart() {
  const carregando = document.getElementById('carregamento-ideb');
  const erro = document.getElementById('erro-ideb');
  const chartContainer = document.getElementById('idebChart');

  // Exibir carregamento, esconder gráfico e erro
  carregando.style.display = 'block';
  erro.style.display = 'none';
  chartContainer.innerHTML = '';

  try {
    const dados = await dadosIdeb();

    // Validar dados obrigatórios
    if (!dados || !dados.categorias || !dados.idebObtido || !dados.idebEsperado) {
      throw new Error('Dados incompletos');
    }

    // Destruir gráfico anterior, se existir
    if (typeof idebChart !== 'undefined' && idebChart) {
      idebChart.destroy();
    }

    const cidadeSelecionada = cidade.options[cidade.selectedIndex].text;
    const estadoSelecionado = estado.options[estado.selectedIndex].text;

    const titleText = cidade.value !== '' 
      ? `Nota do IDEB - ${cidadeSelecionada}, ${estadoSelecionado}` 
      : `Nota do IDEB - ${estadoSelecionado}`;

    // Criar gráfico
    idebChart = Highcharts.chart('idebChart', {
      chart: { type: 'line' },
      title: { text: titleText },
      xAxis: { categories: dados.categorias },
      yAxis: {
        min: 0,
        max: 10,
        title: { text: 'Nota' }
      },
      tooltip: { shared: true },
      series: [
        {
          name: 'IDEB Obtido',
          data: dados.idebObtido,
          color: 'green',
        },
        {
          name: 'IDEB Esperada',
          data: dados.idebEsperado,
          dashStyle: 'Dash',
          color: 'gray',
        }
      ],
      credits: { enabled: false },
      accessibility: { enabled: false }
    });

  } catch (e) {
    console.error('Erro ao gerar gráfico IDEB:', e);
    erro.style.display = 'block';
    chartContainer.innerHTML = ''; // Garante que o gráfico antigo não apareça
  } finally {
    carregando.style.display = 'none';
  }
}
