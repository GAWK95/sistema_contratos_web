const mongoose = require('mongoose');

async function testConnection() {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("✅ Conectado a MongoDB Atlas");
}

module.exports = { testConnection };
