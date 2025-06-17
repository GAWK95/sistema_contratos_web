document.addEventListener('DOMContentLoaded', () => {
  const tablaBody = document.querySelector('#tabla-empleados tbody');
  const filtroInput = document.getElementById('filtro');
  const guardarBtn = document.getElementById('btn-guardar');
  const generarBtn = document.getElementById('btn-generar-word');
  const eliminarBtn = document.getElementById('btn-eliminar'); // ✅ NUEVO

  // 🔄 Renderizar empleados
  async function cargarEmpleados() {
    try {
      const res = await fetch('/api/empleados');
      const empleados = await res.json();
      renderTabla(empleados);
    } catch (err) {
      console.error('Error al cargar empleados:', err);
    }
  }

  // 🧠 Filtrar empleados
  filtroInput.addEventListener('input', async () => {
    const valor = filtroInput.value.trim().toLowerCase();
    try {
      const res = await fetch('/api/empleados');
      const empleados = await res.json();
      const filtrados = empleados.filter(e =>
        e.nombre.toLowerCase().includes(valor) ||
        e.id.toLowerCase().includes(valor) ||
        (e.tipoContrato || '').toLowerCase().includes(valor)
      );
      renderTabla(filtrados);
    } catch (err) {
      console.error('Error al filtrar empleados:', err);
    }
  });

  // 📋 Rellenar tabla
  function renderTabla(lista) {
    tablaBody.innerHTML = '';
    lista.forEach(emp => {
      const fila = document.createElement('tr');
      fila.innerHTML = `
        <td>${emp.id}</td>
        <td>${emp.nombre}</td>
        <td>${emp.puesto}</td>
        <td>${emp.tipoContrato}</td>
        <td>${emp.edad}</td>
        <td>
          <button class="btn btn-sm btn-warning btn-editar" data-id="${emp.id}">
            <i class="fas fa-edit"></i>
          </button>
        </td>
      `;
      tablaBody.appendChild(fila);
    });

    document.querySelectorAll('.btn-editar').forEach(btn => {
      btn.addEventListener('click', async e => {
        const id = e.currentTarget.dataset.id;
        try {
          const res = await fetch(`/api/empleados/${id}`);
          const data = await res.json();
          llenarFormulario(data);
        } catch (err) {
          mostrarAlerta('No se pudo cargar el empleado', 'danger');
        }
      });
    });
  }

  // 🧾 Llenar formulario
  function formatDateOnly(dateString) {
    return new Date(dateString).toISOString().split('T')[0];
  }

  function llenarFormulario(emp) {
    document.getElementById('id').value = emp.id;
    document.getElementById('nombre').value = emp.nombre;
    document.getElementById('tipo-contrato').value = emp.tipoContrato;
    document.getElementById('puesto').value = emp.puesto;
    document.getElementById('edad').value = emp.edad;
    document.getElementById('nacionalidad').value = emp.nacionalidad;
    document.getElementById('sexo').value = emp.sexo;
    document.getElementById('estadoCivil').value = emp.estadoCivil;
    document.getElementById('curp').value = emp.curp;
    document.getElementById('rfc').value = emp.rfc;
    document.getElementById('claveINE').value = emp.claveINE;
    document.getElementById('domicilio').value = emp.domicilio;
    document.getElementById('duracionContrato').value = emp.duracionContrato;
    document.getElementById('sueldoPesos').value = emp.sueldoPesos;
    document.getElementById('sueldoLetra').value = emp.sueldoLetra;
    document.getElementById('fechaContrato').value = formatDateOnly(emp.fechaContrato);
    document.getElementById('fechaVencimiento').value = formatDateOnly(emp.fechaVencimiento);
  }

  // 🧠 Obtener datos formulario
  function obtenerDatosFormulario() {
    const sueldoRaw = document.getElementById('sueldoPesos').value;
    return {
      id: document.getElementById('id').value.trim(),
      nombre: document.getElementById('nombre').value.trim(),
      tipoContrato: document.getElementById('tipo-contrato').value,
      puesto: document.getElementById('puesto').value,
      edad: document.getElementById('edad').value,
      nacionalidad: document.getElementById('nacionalidad').value,
      sexo: document.getElementById('sexo').value,
      estadoCivil: document.getElementById('estadoCivil').value,
      curp: document.getElementById('curp').value,
      rfc: document.getElementById('rfc').value,
      claveINE: document.getElementById('claveINE').value,
      domicilio: document.getElementById('domicilio').value,
      duracionContrato: document.getElementById('duracionContrato').value,
      sueldoPesos: sueldoRaw.replace(/[^\d.]/g, ''),
      sueldoLetra: document.getElementById('sueldoLetra').value,
      fechaContrato: document.getElementById('fechaContrato').value,
      fechaVencimiento: document.getElementById('fechaVencimiento').value
    };
  }

  // 💾 Guardar
  guardarBtn.addEventListener('click', async () => {
    const datos = obtenerDatosFormulario();

    if (!datos.id || !datos.nombre || !datos.tipoContrato || !datos.puesto) {
      mostrarAlerta('Faltan campos obligatorios', 'danger');
      return;
    }

    try {
      const metodo = await existeEmpleado(datos.id) ? 'PUT' : 'POST';
      const url = metodo === 'PUT' ? `/api/empleados/${datos.id}` : '/api/empleados';

      const res = await fetch(url, {
        method: metodo,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Error al guardar');
      }

      mostrarAlerta(metodo === 'POST' ? 'Empleado creado' : 'Empleado actualizado');
      cargarEmpleados();
    } catch (err) {
      mostrarAlerta(err.message || 'Error al guardar empleado', 'danger');
    }
  });

  // 📄 Generar contrato
  generarBtn.addEventListener('click', async () => {
    const id = document.getElementById('id').value.trim();
    const plantillaSelect = document.getElementById('tipoContratoPlantilla');

    if (!plantillaSelect || !plantillaSelect.value) {
      mostrarAlerta('Debes seleccionar una plantilla de contrato.', 'danger');
      return;
    }

    const plantilla = plantillaSelect.value.trim();

    if (!id || !plantilla) {
      mostrarAlerta('ID y Plantilla de contrato requeridos', 'danger');
      return;
    }

    try {
      const res = await fetch(`/api/contratos/generar/${plantilla}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ empleadoId: id })
      });

      if (!res.ok) throw new Error();
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Contrato_${plantilla}_${id}.docx`;
      a.click();
      mostrarAlerta('Contrato generado correctamente');
    } catch {
      mostrarAlerta('Error al generar contrato', 'danger');
    }
  });

  // 🗑️ Eliminar empleado
  eliminarBtn.addEventListener('click', async () => {
    const id = document.getElementById('id').value.trim();

    if (!id) {
      mostrarAlerta('ID requerido para eliminar', 'danger');
      return;
    }

    if (!confirm(`¿Estás seguro que deseas eliminar al empleado con ID ${id}?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/empleados/${id}`, {
        method: 'DELETE'
      });

      if (!res.ok) throw new Error('Error al eliminar empleado');

      mostrarAlerta('Empleado eliminado correctamente');
      document.getElementById('formulario-empleado').reset();
      cargarEmpleados();
    } catch (err) {
      mostrarAlerta('No se pudo eliminar', 'danger');
      console.error(err);
    }
  });

  // 🔍 Validar existencia
  async function existeEmpleado(id) {
    try {
      const res = await fetch(`/api/empleados/${id}`);
      return res.ok;
    } catch {
      return false;
    }
  }

  // 🔔 Alertas
  function mostrarAlerta(mensaje, tipo = 'success') {
    const div = document.createElement('div');
    div.className = `alert alert-${tipo} fixed-top text-center m-3`;
    div.textContent = mensaje;
    document.body.appendChild(div);
    setTimeout(() => div.remove(), 3000);
  }

  // 🚀 Cargar inicial
  cargarEmpleados();
});
