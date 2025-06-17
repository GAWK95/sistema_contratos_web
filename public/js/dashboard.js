document.addEventListener('DOMContentLoaded', async () => {
  const totalEl = document.getElementById('total-contratos');
  const vencidosEl = document.getElementById('contratos-vencidos');
  const porVencerEl = document.getElementById('contratos-por-vencer');
  const tableBody = document.getElementById('contratos-table');
  const searchInput = document.getElementById('search-input');

  let contratos = [];

  await cargarDashboard();

  // 🔍 Filtro en tiempo real
  searchInput.addEventListener('input', () => {
    const q = searchInput.value.toLowerCase();
    const filtrados = contratos.filter(c =>
      c.nombre.toLowerCase().includes(q) ||
      c.id.toLowerCase().includes(q) ||
      c.tipo.toLowerCase().includes(q)
    );
    renderTabla(filtrados);
  });

  async function cargarDashboard() {
    try {
      const resumen = await fetchJSON('/api/contratos/resumen');
      const estadisticas = await fetchJSON('/api/contratos/estadisticas');
      const lista = await fetchJSON('/api/contratos/listado');
      const alertas = await fetchJSON('/api/contratos/alertas');
renderAlertas(alertas);


      contratos = lista.data; // ✅ Corrección aquí
      renderCards(resumen);
      renderTabla(contratos);
      renderCharts(estadisticas);
    } catch (err) {
      console.error('Error al cargar dashboard:', err);
      alert('Error al cargar dashboard');
    }
  }

  function renderCards(data) {
    totalEl.textContent = data.total ?? 0;
    vencidosEl.textContent = data.vencidos ?? 0;
    porVencerEl.textContent = data.por_vencer ?? 0;
  }

  function renderTabla(lista) {
    tableBody.innerHTML = lista.map(c => `
      <tr>
        <td>${c.id}</td>
        <td>${c.nombre}</td>
        <td>${c.tipo_contrato || c.tipo}</td>
        <td>${formatDate(c.fecha_vencimiento)}</td>
        <td>${estadoBadge(c.fecha_vencimiento)}</td>
      </tr>
    `).join('');
  }

  function estadoBadge(fechaStr) {
    const hoy = new Date();
    const fecha = new Date(fechaStr);
    const diff = (fecha - hoy) / (1000 * 60 * 60 * 24);

    if (diff < 0) return `<span class="badge bg-danger">Vencido</span>`;
    if (diff <= 7) return `<span class="badge bg-warning text-dark">Por vencer</span>`;
    return `<span class="badge bg-success">Vigente</span>`;
  }

  function renderCharts(data) {
    const tipoCtx = document.getElementById('chartTipoContrato').getContext('2d');
    const estadosCtx = document.getElementById('chartEstados').getContext('2d');

    const tipos = {};
    data.tipos.forEach(item => {
      tipos[item.tipo] = item.total;
    });

    new Chart(tipoCtx, {
      type: 'doughnut',
      data: {
        labels: Object.keys(tipos),
        datasets: [{
          data: Object.values(tipos),
          backgroundColor: ['#3498db', '#9b59b6', '#1abc9c', '#f39c12']
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    });

    const v = data.vencimientos;
    const estados = {
      Vencidos: v.vencidos,
      'Esta semana': v.esta_semana,
      'Este mes': v.este_mes,
      Vigentes: v.vigentes
    };

    new Chart(estadosCtx, {
      type: 'bar',
      data: {
        labels: Object.keys(estados),
        datasets: [{
          label: 'Contratos',
          data: Object.values(estados),
          backgroundColor: ['#dc3545', '#ffc107', '#0dcaf0', '#28a745']
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { stepSize: 1 }
          }
        }
      }
    });
  }

  function formatDate(fechaStr) {
    return new Date(fechaStr).toLocaleDateString('es-MX');
  }

  async function fetchJSON(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Error en ' + url);
    return await res.json();
  }
});
function renderAlertas(lista) {
  const contenedor = document.getElementById('lista-alertas');
  contenedor.innerHTML = '';

  if (lista.length === 0) {
    contenedor.innerHTML = '<li class="list-group-item text-muted">Sin alertas próximas</li>';
    return;
  }

  lista.forEach(c => {
    const vencimiento = new Date(c.fecha_vencimiento);
    const hoy = new Date();
    const diff = Math.floor((vencimiento - hoy) / (1000 * 60 * 60 * 24));
    let badge = '';

    if (diff < 0) {
      badge = `<span class="badge bg-danger ms-auto">Vencido</span>`;
    } else {
      badge = `<span class="badge bg-warning text-dark ms-auto">${diff} días</span>`;
    }

    const li = document.createElement('li');
    li.className = 'list-group-item d-flex justify-content-between align-items-center';
    li.innerHTML = `
      <div>
        <strong>${c.nombre}</strong> - ${c.puesto}
        <br><small>Vence: ${vencimiento.toLocaleDateString('es-MX')}</small>
      </div>
      ${badge}
    `;
    contenedor.appendChild(li);
  });
}
