document.addEventListener('DOMContentLoaded', () => {
  const formAddAtividade = document.getElementById('form-atividade');
  const formAddCategoria = document.getElementById('adicionar-nova-categoria');
  const btnNovaCategoria = document.getElementById('btn-nova-categoria');
  const chartContainer = document.getElementById('grafico-categorias');

  const selectCategoriaExistente = document.querySelector('select#select-categoria');

  const btnLimpar = document.getElementById('limpar-dados');
  
  let chart;

  function salvarCategoria(categoria) {
    const categorias = JSON.parse(localStorage.getItem('categorias')) || [];
    categorias.push(categoria);
    localStorage.setItem('categorias', JSON.stringify(categorias));
  }

  function carregarCategorias() {
    return JSON.parse(localStorage.getItem('categorias')) || [];
  }

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
      type: 'doughnut',
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
            display: false
          },
          title: {
            display: false,
            text: 'Tempo dedicado por categoria'
          }
        }
      }
    });
  }

  function atualizarSelectCategorias() {
    //NO SELECT:
    //remove antigas
    selectCategoriaExistente.innerHTML = '';

    const categorias = carregarCategorias();

    //adiciona categorias existentes no select
    categorias.forEach(cat => {
      const option = document.createElement('option');
      option.value = cat;
      option.textContent = cat;
      selectCategoriaExistente.appendChild(option);
    });

    //NO CATEGORIAS VISUAIS
    const container = document.getElementById('categorias-visuais');

    // Remove antigos
    container.querySelectorAll('.categoria-btn').forEach(btn => btn.remove());

    // Adiciona novos antes do botão +
    categorias.forEach(cat => {
      const btn = document.createElement('button');
      btn.innerText = cat;
      btn.classList.add('categoria-btn');

      container.insertBefore(btn, btnNovaCategoria);
    });

  }

  formAddCategoria.addEventListener('submit', (e) => {
    e.preventDefault();

    const categoria = formAddCategoria['categoria'].value.trim();

    if (categoria) {
      const categorias = carregarCategorias();
      if (categorias.includes(categoria)) {
        alert('Essa categoria já existe.');
        return;
      }

      salvarCategoria(categoria);
      atualizarSelectCategorias();
      
      formAddCategoria.reset();
      formAddCategoria.classList.toggle('hidden');
      document.querySelector('#texto-btn-nova-categoria').classList.toggle('girar');
    }
  });

  btnNovaCategoria.addEventListener('click', () => {
    formAddCategoria.classList.toggle('hidden');
    document.querySelector('#texto-btn-nova-categoria').classList.toggle('girar');
    formAddCategoria.querySelector('input').focus();
  });

  formAddAtividade.addEventListener('submit', (e) => {
    e.preventDefault();

    const atividade = {
      nome: formAddAtividade['nome-atividade'].value,
      categoria: formAddAtividade['select-categoria'].value,
      tempo: formAddAtividade['tempo'].value,
      data: formAddAtividade['data-atividade'].value
    };

    salvarAtividade(atividade);
    renderizarGrafico();
    formAddAtividade.reset();
    formAddAtividade.querySelector('input').focus();
  });

  atualizarSelectCategorias();
  renderizarGrafico();

  btnLimpar.addEventListener('click', () => {
    if (confirm('Tem certeza que deseja apagar todos os dados?')) {
      localStorage.removeItem('atividades');
      localStorage.removeItem('categorias');

      atualizarSelectCategorias();
      renderizarGrafico();
    }
  });
});
