const fs = require('fs');
const path = require('path');
const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');

// 🧠 Carga plantilla por nombre de contrato
const plantilla = 'Recepcionista'; // Cambia por Cocinero, Enfermeria, etc
const ruta = path.join(__dirname, 'templates', `Contrato_${plantilla}.docx`);

if (!fs.existsSync(ruta)) {
  console.error(`❌ Plantilla no encontrada: ${ruta}`);
  process.exit(1);
}

const content = fs.readFileSync(ruta, 'binary');
const zip = new PizZip(content);
const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });

// 💾 Simula un empleado de ejemplo
const empleado = {
  NombredelEmpleado: 'Juan Pérez',
  ID: 'EMP123',
  TipodeContrato: 'Determinado',
  Puesto: 'Cocinero',
  Edad: '32',
  Nacionalidad: 'Mexicana',
  Sexo: 'Masculino',
  EstadoCivil: 'Soltero',
  CURP: 'PEJJ850101HDFLRN00',
  RFC: 'PEJJ850101AAA',
  ClaveINE: 'INE0012345678',
  Domicilio: 'Calle Falsa 123',
  DuraciondeContrato: '6 meses',
  Sueldoenpesos: '8500',
  SueldoenLetra: 'Ocho mil quinientos',
  FechadeContrato: '2024-01-01',
  FechadeVencimiento: '2024-07-01'
};

// 🔍 Asignar datos simulados
doc.setData(empleado);

try {
  doc.render(); // Intenta reemplazar variables
  console.log('✅ Plantilla procesada correctamente. Todas las variables existen.');
} catch (error) {
  console.error('\n❌ ERROR al renderizar plantilla\n');
  console.error(error.message);

  if (error.properties && error.properties.errors) {
    console.log('\n🧪 Variables faltantes en la plantilla:');
    error.properties.errors.forEach(e => {
      console.log(`❌ Faltante: ${e.properties.explanation}`);
    });
  } else {
    console.log('⚠️ No se pudieron extraer detalles del error');
  }
}
