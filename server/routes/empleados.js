const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');

// 🔁 Mapea datos camelCase del frontend ➜ columnas snake_case en DB
function mapEmpleadoBody(data) {
  return {
    nombre: data.nombre,
    tipo_contrato: data.tipoContrato,
    puesto: data.puesto,
    edad: data.edad,
    nacionalidad: data.nacionalidad,
    sexo: data.sexo,
    estado_civil: data.estadoCivil,
    curp: data.curp,
    rfc: data.rfc,
    clave_ine: data.claveINE,
    domicilio: data.domicilio,
    duracion_contrato: data.duracionContrato,
    sueldo_pesos: data.sueldoPesos?.replace(/[^\d.]/g, '') ?? null,
    sueldo_letra: data.sueldoLetra,
    fecha_contrato: data.fechaContrato,
    fecha_vencimiento: data.fechaVencimiento
  };
}

// ✅ Obtener todos los empleados
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM empleados');
    const empleados = rows.map(emp => ({
      id: emp.id,
      nombre: emp.nombre,
      tipoContrato: emp.tipo_contrato,
      puesto: emp.puesto,
      edad: emp.edad
    }));
    res.json(empleados);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener empleados' });
  }
});

// 🔍 Buscar empleados por ID, nombre o tipoContrato
router.get('/buscar', async (req, res) => {
  const { query } = req.query;
  if (!query) return res.status(400).json({ error: 'Falta el parámetro query' });

  try {
    const like = `%${query}%`;
    const [rows] = await pool.query(
      `SELECT id, nombre, tipo_contrato AS tipoContrato, puesto, edad
       FROM empleados
       WHERE id LIKE ? OR nombre LIKE ? OR tipo_contrato LIKE ? OR puesto LIKE ?`,
      [like, like, like, like]
    );
    res.json(rows);
  } catch (err) {
    console.error('Error búsqueda múltiple:', err);
    res.status(500).json({ error: 'Error al buscar empleados' });
  }
});

// 📄 Obtener empleado por ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM empleados WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Empleado no encontrado' });

    const emp = rows[0];
    res.json({
      id: emp.id,
      nombre: emp.nombre,
      tipoContrato: emp.tipo_contrato,
      puesto: emp.puesto,
      edad: emp.edad,
      nacionalidad: emp.nacionalidad,
      sexo: emp.sexo,
      estadoCivil: emp.estado_civil,
      curp: emp.curp,
      rfc: emp.rfc,
      claveINE: emp.clave_ine,
      domicilio: emp.domicilio,
      duracionContrato: emp.duracion_contrato,
      sueldoPesos: emp.sueldo_pesos ? `$${parseFloat(emp.sueldo_pesos).toFixed(2)}` : '',
      sueldoLetra: emp.sueldo_letra,
      fechaContrato: emp.fecha_contrato,
      fechaVencimiento: emp.fecha_vencimiento
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al buscar empleado' });
  }
});

// 🆕 Crear nuevo empleado
router.post('/', async (req, res) => {
  const datos = mapEmpleadoBody(req.body);
  datos.id = req.body.id;

  if (datos.rfc && datos.rfc.length > 13) {
    return res.status(400).json({ error: 'RFC supera los 13 caracteres permitidos.' });
  }

  try {
    const [result] = await pool.query('INSERT INTO empleados SET ?', [datos]);
    res.status(201).json({ id: datos.id, message: 'Empleado creado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear empleado' });
  }
});

// ✏️ Actualizar empleado existente
router.put('/:id', async (req, res) => {
  const datos = mapEmpleadoBody(req.body);

  if (datos.rfc && datos.rfc.length > 13) {
    return res.status(400).json({ error: 'RFC supera los 13 caracteres permitidos.' });
  }

  try {
    const [result] = await pool.query('UPDATE empleados SET ? WHERE id = ?', [datos, req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Empleado no encontrado' });
    }
    res.json({ message: 'Empleado actualizado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar empleado' });
  }
});

// 🗑️ Eliminar empleado
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM empleados WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Empleado no encontrado' });
    }
    res.json({ message: 'Empleado eliminado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar empleado' });
  }
});

module.exports = router;
