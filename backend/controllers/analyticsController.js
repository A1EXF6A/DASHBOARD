const { FactVentas, FactVentasCombo, FactInventario, FactFabricacion, FactDistribucion, FactAbastecimiento } = require('../models');

// Helper to construct basic matches
const buildMatch = (query) => {
  const match = {};
  if (query.categoria && query.categoria !== 'All') {
    match['Producto.Categoria'] = query.categoria;
  }
  if (query.region && query.region !== 'All') {
    // Not all collections have Ubicacion, applied only where possible
    match['Ubicacion.Region'] = query.region;
  }
  if (query.anio && query.anio !== 'All') {
    match['Tiempo.Anio'] = parseInt(query.anio, 10);
  }
  return match;
};

exports.getProfitability = async (req, res) => {
  try {
    const matchProps = buildMatch(req.query);
    // Remove region as it's not directly on FactVentas in the simplest sample model
    delete matchProps['Ubicacion.Region'];
    
    const pipeline = [];
    if (Object.keys(matchProps).length > 0) pipeline.push({ $match: matchProps });
    
    pipeline.push(
      {
        $group: {
          _id: "$Producto.ProductoKey",
          nombre: { $first: "$Producto.NombreProducto" },
          categoria: { $first: "$Producto.Categoria" },
          ingresoTotal: { $sum: "$IngresoTotal" },
          costoTotal: { $sum: { $add: ["$CostoProducto", "$CostoLogistico"] } },
          margenNeto: { $sum: "$MargenNeto" },
          volumenVentas: { $sum: "$CantidadVendida" }
        }
      },
      { $sort: { margenNeto: -1 } },
      { $limit: 100 }
    );
    
    const data = await FactVentas.aggregate(pipeline);
    res.json(data);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

exports.getProductCombos = async (req, res) => {
  try {
    const matchProps = buildMatch(req.query);
    delete matchProps['Ubicacion.Region'];
    delete matchProps['Producto.Categoria']; // FactVentasCombo doesn't have Producto embedded
    
    const pipeline = [];
    if (Object.keys(matchProps).length > 0) pipeline.push({ $match: matchProps });
    
    pipeline.push(
      {
        $group: {
          _id: "$ComboProducto.ComboProductoKey",
          productoKey1: { $first: "$ComboProducto.ProductoKey1" },
          productoKey2: { $first: "$ComboProducto.ProductoKey2" },
          ingresoTotal: { $sum: "$IngresoTotal" },
          margenNeto: { $sum: "$MargenNeto" },
          cantidadVendida: { $sum: { $add: ["$CantidadProducto1", "$CantidadProducto2"] } }
        }
      },
      { $sort: { margenNeto: -1 } },
      { $limit: 20 },
      {
        $lookup: {
          from: "FactVentas",
          let: { key1: "$productoKey1" },
          pipeline: [
            { $match: { $expr: { $eq: ["$Producto.ProductoKey", "$$key1"] } } },
            { $limit: 1 },
            { $project: { _id: 0, "Producto.NombreProducto": 1 } }
          ],
          as: "p1Data"
        }
      },
      {
        $lookup: {
          from: "FactVentas",
          let: { key2: "$productoKey2" },
          pipeline: [
            { $match: { $expr: { $eq: ["$Producto.ProductoKey", "$$key2"] } } },
            { $limit: 1 },
            { $project: { _id: 0, "Producto.NombreProducto": 1 } }
          ],
          as: "p2Data"
        }
      },
      {
        $addFields: {
          nombreProducto1: { $arrayElemAt: ["$p1Data.Producto.NombreProducto", 0] },
          nombreProducto2: { $arrayElemAt: ["$p2Data.Producto.NombreProducto", 0] }
        }
      },
      {
         $project: {
             p1Data: 0,
             p2Data: 0
         }
      }
    );
    
    const data = await FactVentasCombo.aggregate(pipeline);
    res.json(data);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

exports.getInventoryMisalignment = async (req, res) => {
  try {
    const matchProps = buildMatch(req.query);
    delete matchProps['Ubicacion.Region']; // FactInventario has Sucursal, not Ubicacion directly
    
    const pipeline = [];
    if (Object.keys(matchProps).length > 0) pipeline.push({ $match: matchProps });
    
    pipeline.push(
      {
        $group: {
          _id: {
            producto: "$Producto.ProductoKey",
            sucursal: "$Sucursal.SucursalKey"
          },
          nombreProducto: { $first: "$Producto.NombreProducto" },
          sucursalNombre: { $first: "$Sucursal.NombreSucursal" },
          stockPromedio: { $avg: "$StockFinal" },
          ventasTotales: { $sum: "$VentasPeriodo" }
        }
      },
      {
        $project: {
          nombreProducto: 1,
          sucursalNombre: 1,
          stockPromedio: 1,
          ventasTotales: 1,
          ratioDesalineacion: { 
            $cond: [
              { $eq: ["$ventasTotales", 0] }, 
              0, 
              { $divide: ["$stockPromedio", "$ventasTotales"] }
            ] 
          }
        }
      },
      { $sort: { ratioDesalineacion: -1 } },
      { $limit: 50 }
    );
    
    const data = await FactInventario.aggregate(pipeline);
    res.json(data);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

exports.getTerritoryGrowth = async (req, res) => {
  try {
    const matchProps = buildMatch(req.query);
    delete matchProps['Ubicacion.Region'];
    
    const pipeline = [];
    if (Object.keys(matchProps).length > 0) pipeline.push({ $match: matchProps });
    
    pipeline.push(
      {
        $group: {
          _id: {
             canal: "$Canal.TipoCanal",
             anio: "$Tiempo.Anio",
             mes: "$Tiempo.Mes"
          },
          ingresos: { $sum: "$IngresoTotal" },
          clientes: { $addToSet: "$Cliente.ClienteKey" }
        }
      },
      {
        $project: {
          ingresos: 1,
          clientesUnicos: { $size: "$clientes" }
        }
      },
      { $sort: { "_id.anio": 1, "_id.mes": 1 } }
    );
    
    const data = await FactVentas.aggregate(pipeline);
    res.json(data);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

exports.getTransportCosts = async (req, res) => {
  try {
    const matchProps = buildMatch(req.query);
    delete matchProps['Ubicacion.Region'];
    
    const pipeline = [];
    if (Object.keys(matchProps).length > 0) pipeline.push({ $match: matchProps });
    
    pipeline.push(
      {
        $group: {
          _id: "$MetodoEnvio.NombreMetodoEnvio",
          costoLogisticoTotal: { $sum: "$CostoLogistico" },
          ingresoTotal: { $sum: "$IngresoTotal" }
        }
      },
      {
        $project: {
          costoLogisticoTotal: 1,
          ingresoTotal: 1,
          ratioCostoVsIngreso: { 
            $cond: [
               { $eq: ["$ingresoTotal", 0] },
               0,
               { $multiply: [ { $divide: ["$costoLogisticoTotal", "$ingresoTotal"] }, 100 ] }
            ]
          }
        }
      },
      { $sort: { ratioCostoVsIngreso: -1 } }
    );
    
    const data = await FactVentas.aggregate(pipeline);
    res.json(data);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

exports.getSupplierLeadTimes = async (req, res) => {
  try {
    const matchProps = buildMatch(req.query);
    delete matchProps['Ubicacion.Region'];
    // Tiempo.Anio may not apply if dataset uses TiempoEntregaDias exclusively without standard Tiempo embedding, but we'll apply it just in case.
    
    const pipeline = [];
    if (Object.keys(matchProps).length > 0) pipeline.push({ $match: matchProps });
    
    pipeline.push(
      {
        $group: {
          _id: "$Proveedor.NombreProveedor",
          tiempoEntregaPromedio: { $avg: "$TiempoEntregaDias" },
          totalCompras: { $sum: 1 },
          costoTotal: { $sum: "$CostoTotalCompra" }
        }
      },
      { $sort: { tiempoEntregaPromedio: -1 } },
      { $limit: 20 }
    );
    
    const data = await FactAbastecimiento.aggregate(pipeline);
    res.json(data);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

exports.getComponentsDistribution = async (req, res) => {
  try {
    const matchProps = buildMatch(req.query);
    delete matchProps['Ubicacion.Region'];
    
    const pipeline = [];
    if (Object.keys(matchProps).length > 0) pipeline.push({ $match: matchProps });
    
    pipeline.push(
      {
        $group: {
          _id: "$Producto.Categoria",
          totalComponentes: { $sum: "$NumeroComponentes" },
          unidadesFabricadas: { $sum: "$UnidadesFabricadas" }
        }
      },
      {
        $project: {
          totalComponentes: 1,
          unidadesFabricadas: 1,
          componentesPorUnidad: {
            $cond: [
              { $eq: ["$unidadesFabricadas", 0] },
              0,
              { $divide: ["$totalComponentes", "$unidadesFabricadas"] }
            ]
          }
        }
      },
      { $sort: { totalComponentes: -1 } }
    );
    const data = await FactFabricacion.aggregate(pipeline);
    res.json(data);
  } catch (error) { res.status(500).json({ error: error.message }); }
};
