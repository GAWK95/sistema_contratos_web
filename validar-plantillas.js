const fs = require('fs');
const path = require('path');
const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');

const TEMPLATE_DIR = path.join(__dirname, 'templates');

function scanTemplates() {
  const archivos = fs.readdirSync(TEMPLATE_DIR);
  return archivos.filter(file => file.endsWith('.docx') || file.endsWith('.docm'));
}

function validarPlantilla(nombreArchivo) {
  const ruta = path.join(TEMPLATE_DIR, nombreArchivo);
  const contenido = fs.readFileSync(ruta, 'binary');

  try {
    const zip = new PizZip(contenido);
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });

    doc.render(); // Simula renderizado
    return { archivo: nombreArchivo, valido: true };
  } catch (err) {
    return {
      archivo: nombreArchivo,
      valido: false,
      error: err.message,
      detalle: err.properties?.explanation || 'No se pudo determinar causa exacta'
    };
  }
}

function ejecutarValidacion() {
  const templates = scanTemplates();
  console.log(`🧠 Analizando ${templates.length} plantillas...\n`);

  const errores = [];

  templates.forEach(nombre => {
    const resultado = validarPlantilla(nombre);

    if (resultado.valido) {
      console.log(`✅ ${nombre} - OK`);
    } else {
      console.log(`❌ ${nombre} - Error: ${resultado.detalle}`);
      errores.push(resultado);
    }
  });

  if (errores.length > 0) {
    console.log(`\n🚨 Se encontraron ${errores.length} plantilla(s) con error(es):`);
    errores.forEach(err => {
      console.log(`📄 ${err.archivo}\n   ↳ ${err.detalle}\n`);
    });
  } else {
    console.log('\n✅ Todas las plantillas son válidas. ¡Buen trabajo!');
  }
}

ejecutarValidacion();
