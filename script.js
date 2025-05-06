document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form-atividade');
  const chartContainer = document.getElementById('grafico-categorias');

  let chart;

  function salvarAtividade(atividade) {
    const atividades = JSON.parse(localStorage.getItem('atividades')) || [];
    atividades.push(atividade);
    localStorage.setItem('atividades', JSON.stringify(atividades));
  }

  function carregarAtividades() {
    return JSON.parse(localStorage.getItem('atividades')) || [];
  }

  function gerarDadosGrafico(atividades) {
    const categorias = {};

    atividades.forEach(a => {
      categorias[a.categoria] = (categorias[a.categoria] || 0) + parseInt(a.tempo);
    });

    return {
      labels: Object.keys(categorias),
      data: Object.values(categorias)
    };
  }

  function renderizarGrafico() {
    const atividades = carregarAtividades();
    const dados = gerarDadosGrafico(atividades);

    if (chart) chart.destroy();

    chart = new Chart(chartContainer, {
      type: 'pie',
      data: {
        labels: dados.labels,
        datasets: [{
          data: dados.data,
          backgroundColor: [
            '#007bff', // azul
            '#28a745', // verde
            '#ffc107', // amarelo
            '#dc3545', // vermelho
            '#6f42c1'  // roxo
          ]
        }]
      },
      options: {
        plugins: {
          legend: {
            position: 'right'
          },
          title: {
            display: true,
            text: 'Tempo dedicado por categoria'
          }
        }
      }
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const atividade = {
      nome: form['nome-atividade'].value,
      categoria: form['categoria'].value,
      tempo: form['tempo'].value,
      data: form['data-atividade'].value
    };

    salvarAtividade(atividade);
    renderizarGrafico();
    form.reset();
    form.querySelector('input').focus();
  });

  renderizarGrafico();
});
