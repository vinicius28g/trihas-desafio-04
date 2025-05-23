let idebEstadoChart = null;
async function gerarGraficoMapaIdeb() {


  const dadosMapaIdeb = await dadosIdebEstado();
  console.log("Dados Mapa IDEB:", dadosMapaIdeb);
  if (idebEstadoChart) idebEstadoChart.destroy();

  // Gera os dados do mapa
  const data = [
    { "hc-key": "br-ac", value: dadosMapaIdeb.get('ac') },
    { "hc-key": "br-al", value: dadosMapaIdeb.get('al') },
    { "hc-key": "br-am", value: dadosMapaIdeb.get('am') },
    { "hc-key": "br-ap", value: dadosMapaIdeb.get('ap') },
    { "hc-key": "br-ba", value: dadosMapaIdeb.get('ba') },
    { "hc-key": "br-ce", value: dadosMapaIdeb.get('ce') },
    { "hc-key": "br-df", value: dadosMapaIdeb.get('df') },
    { "hc-key": "br-es", value: dadosMapaIdeb.get('es') },
    { "hc-key": "br-go", value: dadosMapaIdeb.get('go') },
    { "hc-key": "br-ma", value: dadosMapaIdeb.get('ma') },
    { "hc-key": "br-mt", value: dadosMapaIdeb.get('mt') },
    { "hc-key": "br-ms", value: dadosMapaIdeb.get('ms') },
    { "hc-key": "br-mg", value: dadosMapaIdeb.get('mg') },
    { "hc-key": "br-pa", value: dadosMapaIdeb.get('pa') },
    { "hc-key": "br-pb", value: dadosMapaIdeb.get('pb') },
    { "hc-key": "br-pr", value: dadosMapaIdeb.get('pr') },
    { "hc-key": "br-pe", value: dadosMapaIdeb.get('pe') },
    { "hc-key": "br-pi", value: dadosMapaIdeb.get('pi') },
    { "hc-key": "br-rj", value: dadosMapaIdeb.get('rj') },
    { "hc-key": "br-rn", value: dadosMapaIdeb.get('rn') },
    { "hc-key": "br-ro", value: dadosMapaIdeb.get('ro') },
    { "hc-key": "br-rr", value: dadosMapaIdeb.get('rr') },
    { "hc-key": "br-rs", value: dadosMapaIdeb.get('rs') },
    { "hc-key": "br-sc", value: dadosMapaIdeb.get('sc') },
    { "hc-key": "br-se", value: dadosMapaIdeb.get('se') },
    { "hc-key": "br-sp", value: dadosMapaIdeb.get('sp') },
    { "hc-key": "br-to", value: dadosMapaIdeb.get('to') }
  ];

  // Substitui a mensagem pelo gráfico
 idebEstadoChart = Highcharts.mapChart('idebEstadosChart', {
    chart: {
      map: 'countries/br/br-all'
    },
    title: {
      text: 'Média do Indicador do IDEB por Estado - Brasil no ano ' + document.getElementById('select_ano').value
    },
    colorAxis: {
      min: 3,
      max: 7,
      stops: [
        [0, '#EFEFFF'],
        [0.5, '#4444FF'],
        [1, '#000022']
      ]
    },
    series: [{
      data: data,
      name: 'Média',
      states: {
        hover: {
          color: '#BADA55'
        }
      },
      dataLabels: {
        enabled: true,
        format: '{point.name}'
      },
      tooltip: {
        pointFormat: '{point.name}: <b>{point.value}</b>'
      }
    }]
  });
} 