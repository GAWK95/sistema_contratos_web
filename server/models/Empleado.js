// /server/models/Empleado.js
const mongoose = require('mongoose');

const EmpleadoSchema = new mongoose.Schema({
  id: String,
  nombre: String,
  tipoContrato: String,
  puesto: String,
  edad: Number,
  nacionalidad: String,
  sexo: String,
  estadoCivil: String,
  curp: String,
  rfc: String,
  claveINE: String,
  domicilio: String,
  duracionContrato: String,
  sueldoPesos: Number,
  sueldoLetra: String,
  fechaContrato: String,
  fechaVencimiento: String,
});

module.exports = mongoose.model('Empleado', EmpleadoSchema);
