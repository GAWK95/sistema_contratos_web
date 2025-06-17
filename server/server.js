// /server/server.js

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const { testConnection } = require('./config/db');

const empleadosRoutes = require('./routes/empleados');
const contratosRoutes = require('./routes/contratos');

const app = express();

// ✅ Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ Archivos estáticos
app.use(express.static(path.join(__dirname, '../public')));

// ✅ Conexión DB
testConnection().catch(err => {
  console.error('❌ Error al conectar a la base de datos:', err);
  process.exit(1);
});

// ✅ Rutas API
app.use('/api/empleados', empleadosRoutes);
app.use('/api/contratos', contratosRoutes);

// 🔐 Ruta opcional para verificar JWT
app.get('/api/auth/verify', (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, 'tu_secreto'); // ⚠️ Reemplaza con tu variable de entorno
    res.sendStatus(200);
  } catch {
    res.sendStatus(401);
  }
});

// ✅ Rutas HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/login.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/dashboard.html'));
});

// ⚠️ Manejo de errores
app.use((err, req, res, next) => {
  console.error('🔥 Error:', err.stack);
  res.status(500).json({ error: 'Algo salió mal!' });
});

// 🚀 Arranque del servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
