const mongoose = require('mongoose');

// We use strict: false because for analytics we mainly read and aggregate,
// and the schema might have embedded dynamic fields that we don't strictly validate.
const AnySchema = new mongoose.Schema({}, { strict: false });

module.exports = {
  FactVentas: mongoose.model('FactVentas', AnySchema, 'FactVentas'),
  FactVentasCombo: mongoose.model('FactVentasCombo', AnySchema, 'FactVentasCombo'),
  FactInventario: mongoose.model('FactInventario', AnySchema, 'FactInventario'),
  FactFabricacion: mongoose.model('FactFabricacion', AnySchema, 'FactFabricacion'),
  FactDistribucion: mongoose.model('FactDistribucion', AnySchema, 'FactDistribucion'),
  FactAbastecimiento: mongoose.model('FactAbastecimiento', AnySchema, 'FactAbastecimiento'),
};
