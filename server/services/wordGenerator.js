const fs = require('fs');
const path = require('path');
const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');

const TEMPLATE_DIR = path.join(__dirname, '../../templates');
const OUTPUT_DIR = path.join(__dirname, '../../contratos');

function cleanField(val) {
  return (val ?? '').toString().toUpperCase();
}


// 🔍 Buscar plantilla .docx o .docm existente
function loadTemplate(tipoContrato) {
  const docxPath = path.join(TEMPLATE_DIR, `Contrato_${tipoContrato}.docx`);
  const docmPath = path.join(TEMPLATE_DIR, `Contrato_${tipoContrato}.docm`);

  if (fs.existsSync(docxPath)) {
    return fs.readFileSync(docxPath, 'binary');
  } else if (fs.existsSync(docmPath)) {
    return fs.readFileSync(docmPath, 'binary');
  } else {
    throw new Error(`❌ No se encontró plantilla: Contrato_${tipoContrato}.docx/.docm`);
  }
}

// 🧠 Mapeo de variables plantilla
function mapEmpleadoToTemplateVars(empleado) {
  return {
    NombredelEmpleado: cleanField(empleado.nombre),
    ID: cleanField(empleado.id),
    TipodeContrato: cleanField(empleado.tipo_contrato),
    Puesto: cleanField(empleado.puesto),
    Edad: cleanField(empleado.edad),
    Nacionalidad: cleanField(empleado.nacionalidad),
    Sexo: cleanField(empleado.sexo),
    EstadoCivil: cleanField(empleado.estado_civil),
    CURP: cleanField(empleado.curp),
    RFC: cleanField(empleado.rfc),
    ClaveINE: cleanField(empleado.clave_ine),
    Domicilio: cleanField(empleado.domicilio),
    DuraciondeContrato: cleanField(empleado.duracion_contrato),
    Sueldoenpesos: cleanField(empleado.sueldo_pesos),
    SueldoenLetra: cleanField(empleado.sueldo_letra),
    FechadeContrato: cleanField(empleado.fecha_contrato),
    FechadeVencimiento: cleanField(empleado.fecha_vencimiento)
  };
}

// ⚙️ Generador de contrato Word
async function generarContrato(empleado, tipoContrato) {
  const content = loadTemplate(tipoContrato);
  const zip = new PizZip(content);

  const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
    delimiters: {
      start: '**',
      end: '**'
    }
  });

  const data = mapEmpleadoToTemplateVars(empleado);
  doc.setData(data);

  try {
    doc.render();
  } catch (err) {
    console.error('⚠️ Error renderizando plantilla Word:', err);
    throw err;
  }

  const buffer = doc.getZip().generate({ type: 'nodebuffer' });

  const empleadoFolder = path.join(OUTPUT_DIR, sanitizeFileName(empleado.nombre));
  if (!fs.existsSync(empleadoFolder)) {
    fs.mkdirSync(empleadoFolder, { recursive: true });
  }

  const fechaActual = new Date().toISOString().split('T')[0];
  const fileName = `Contrato_${tipoContrato}_${fechaActual}.docx`;
  const filePath = path.join(empleadoFolder, fileName);

  fs.writeFileSync(filePath, buffer);
  return filePath;
}

function sanitizeFileName(name) {
  return name.replace(/[<>:"/\\|?*]+/g, '').trim();
}

module.exports = { generarContrato };
