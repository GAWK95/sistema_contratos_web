const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');
const fs = require('fs').promises;
const path = require('path');
const { generarContrato } = require('../services/wordGenerator');

// 📝 Generar contrato Word
router.post('/generar/:tipo', async (req, res) => {
  const { tipo } = req.params;
  const { empleadoId } = req.body;

  try {
    const [rows] = await pool.query('SELECT * FROM empleados WHERE id = ?', [empleadoId]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Empleado no encontrado' });
    }

    const empleado = rows[0];
    const filePath = await generarContrato(empleado, tipo);

    const extension = path.extname(filePath);
    const fileName = `contrato_${tipo}_${empleadoId}${extension}`;

    res.download(filePath, fileName, (err) => {
      if (err) console.error('❌ Error al descargar:', err);
      else fs.unlink(filePath).catch(e => console.error('⚠️ Error al eliminar archivo temporal:', e));
    });
  } catch (err) {
    console.error('🔥 Error al generar contrato:', err);
    res.status(500).json({ error: 'Error al generar contrato' });
  }
});

// 🔔 Alertas de contratos próximos a vencer
router.get('/alertas', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT id, nombre, puesto, fecha_vencimiento 
      FROM empleados 
      WHERE fecha_vencimiento BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 15 DAY)
      ORDER BY fecha_vencimiento ASC
    `);
    res.json(rows);
  } catch (err) {
    console.error('Error en alertas:', err);
    res.status(500).json({ error: 'Error al obtener alertas' });
  }
});

// 📊 Resumen de tarjetas (Dashboard)
router.get('/resumen', async (req, res) => {
  try {
    const [result] = await pool.query(`
      SELECT
        COUNT(*) AS total,
        SUM(CASE WHEN fecha_vencimiento < CURDATE() THEN 1 ELSE 0 END) AS vencidos,
        SUM(CASE WHEN fecha_vencimiento BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 30 DAY) THEN 1 ELSE 0 END) AS por_vencer
      FROM empleados
    `);
    res.json(result[0]);
  } catch (err) {
    console.error('Error en resumen:', err);
    res.status(500).json({ error: 'Error al obtener resumen' });
  }
});

// 📈 Estadísticas para gráficas
router.get('/estadisticas', async (req, res) => {
  try {
    const [tipos] = await pool.query(`
      SELECT tipo_contrato AS tipo, COUNT(*) AS total 
      FROM empleados 
      GROUP BY tipo_contrato
    `);

    const [vencimientos] = await pool.query(`
      SELECT 
        SUM(CASE WHEN fecha_vencimiento < CURDATE() THEN 1 ELSE 0 END) AS vencidos,
        SUM(CASE WHEN fecha_vencimiento BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 7 DAY) THEN 1 ELSE 0 END) AS esta_semana,
        SUM(CASE WHEN fecha_vencimiento BETWEEN DATE_ADD(CURDATE(), INTERVAL 8 DAY) AND DATE_ADD(CURDATE(), INTERVAL 30 DAY) THEN 1 ELSE 0 END) AS este_mes,
        SUM(CASE WHEN fecha_vencimiento > DATE_ADD(CURDATE(), INTERVAL 30 DAY) THEN 1 ELSE 0 END) AS vigentes
      FROM empleados
    `);

    res.json({
      tipos,
      vencimientos: vencimientos[0]
    });
  } catch (err) {
    console.error('Error en estadísticas:', err);
    res.status(500).json({ error: 'Error al obtener estadísticas' });
  }
});

// 📃 Listado paginado de empleados para tabla dashboard
router.get('/listado', async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const offset = (page - 1) * limit;

    const [rows] = await pool.query(`
      SELECT id, nombre, tipo_contrato, puesto, fecha_vencimiento 
      FROM empleados 
      WHERE nombre LIKE ? OR id LIKE ? OR tipo_contrato LIKE ?
      ORDER BY fecha_vencimiento ASC
      LIMIT ? OFFSET ?
    `, [`%${search}%`, `%${search}%`, `%${search}%`, parseInt(limit), parseInt(offset)]);

    const [total] = await pool.query(`
      SELECT COUNT(*) AS total 
      FROM empleados 
      WHERE nombre LIKE ? OR id LIKE ? OR tipo_contrato LIKE ?
    `, [`%${search}%`, `%${search}%`, `%${search}%`]);

    res.json({
      data: rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: total[0].total
      }
    });
  } catch (err) {
    console.error('Error en listado:', err);
    res.status(500).json({ error: 'Error al obtener listado' });
  }
});

module.exports = router;
