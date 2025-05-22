let inseChart = null;

async function criarGraficoInse() {
  // Elementos da interface
  const divCarregando = document.getElementById('carregamento-inse');
  const divErro = document.getElementById('erro-inse');
  const divGrafico = document.getElementById('inseChart');

  // Estado inicial da UI
  divCarregando.style.display = 'block';
  divErro.style.display = 'none';
  divGrafico.style.display = 'none';

  try {
    if (inseChart) inseChart.destroy();

    const dados = await dadosInse();

    // Seleção dos elementos do DOM
    const selectCidade = document.getElementById('cidade');
    const selectEstado = document.getElementById('estado');
    const selectAno = document.getElementById('select_ano');

    const cidadeSelecionada = selectCidade.options[selectCidade.selectedIndex]?.text || '';
    const estadoSelecionado = selectEstado.options[selectEstado.selectedIndex]?.text || '';
    const ano = selectAno.value || '2019';

    const titleText = selectCidade.value !== ''
      ? `Indicador Socioeconômico (INSE) ${ano} - ${cidadeSelecionada}, ${estadoSelecionado}`
      : `Indicador Socioeconômico (INSE) ${ano} - ${estadoSelecionado}`;

    // Criação do gráfico
    inseChart = Highcharts.chart('inseChart', {
      chart: { type: 'column' },
      title: {
        text: titleText,
        style: { fontSize: '16px' }
      },
      xAxis: {
        categories: [
          'Nível 1', 'Nível 2', 'Nível 3', 'Nível 4',
          'Nível 5', 'Nível 6', 'Nível 7', 'Nível 8',
          'INSE Absoluto', 'Classificação'
        ],
        crosshair: true
      },
      yAxis: [
        {
          min: 0,
          title: {
            text: 'Porcentagem ou Nota INSE',
            style: { color: '#007bff' }
          }
        },
        {
          min: 1,
          max: 8,
          opposite: true,
          title: {
            text: 'Classificação (1 a 8)',
            style: { color: '#ffc107' }
          }
        }
      ],
      tooltip: { shared: true },
      series: [
        {
          name: 'Distribuição por Nível (%)',
          data: [
            ...dados.mediasInse.map(n => parseFloat(n)),
            null,
            null
          ],
          color: '#007bff',
          yAxis: 0
        },
        {
          name: 'INSE Absoluto',
          data: [
            ...Array(8).fill(null),
            parseFloat(dados.mediaInse_absoluto),
            null
          ],
          color: '#28a745',
          yAxis: 0
        },
        {
          name: 'Classificação Média',
          data: [
            ...Array(9).fill(null),
            parseFloat(dados.mediaClassificacao)
          ],
          color: '#ffc107',
          yAxis: 1
        }
      ],
      credits: { enabled: false }
    });

   
    divCarregando.style.display = 'none';
    divGrafico.style.display = 'block';
  } catch (err) {
    console.error('Erro ao criar gráfico INSE:', err);
    divCarregando.style.display = 'none';
    divErro.style.display = 'block';
    divGrafico.style.display = 'none';
  }
}