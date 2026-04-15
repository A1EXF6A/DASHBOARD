const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const connectDB = require('../config/db');
const { FactVentas, FactVentasCombo, FactInventario, FactDistribucion, FactAbastecimiento } = require('../models');

const run = async () => {
  await connectDB();
  console.log('Creating indexes...');

  try {
    await FactVentas.collection.createIndex({ 'Tiempo.Fecha': 1, 'Ubicacion.Region': 1, 'Producto.Categoria': 1 });
    await FactVentasCombo.collection.createIndex({ 'ComboProducto.ComboProductoKey': 1 });
    await FactInventario.collection.createIndex({ 'Tiempo.Fecha': 1, 'Sucursal.SucursalKey': 1 });
    await FactDistribucion.collection.createIndex({ 'MetodoEnvio.MetodoEnvioKey': 1 });
    await FactAbastecimiento.collection.createIndex({ 'Proveedor.ProveedorKey': 1 });

    console.log('Indexes created successfully.');
  } catch (error) {
    console.error('Error creating indexes:', error);
  } finally {
    process.exit(0);
  }
};

run();
