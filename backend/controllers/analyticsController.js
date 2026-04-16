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
  if (query.mes && query.mes !== 'All') {
    match['Tiempo.Mes'] = parseInt(query.mes, 10);
  }
  if (query.canal && query.canal !== 'All') {
    match['Canal.TipoCanal'] = query.canal;
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
    delete matchProps['Canal.TipoCanal'];
    
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

exports.getTerritoryMatrix = async (req, res) => {
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
             anio: "$Tiempo.Anio"
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
      { $sort: { "_id.anio": 1 } }
    );
    
    const rawData = await FactVentas.aggregate(pipeline);

    // Node.js post-processing for Growth and Participation
    // 1. Group by Canal
    const canalData = {};
    rawData.forEach(doc => {
      const c = doc._id.canal || 'Unknown';
      if (!canalData[c]) canalData[c] = [];
      canalData[c].push({
        anio: doc._id.anio,
        ingresos: doc.ingresos,
        clientesUnicos: doc.clientesUnicos
      });
    });

    let maxAnio = 0;
    rawData.forEach(doc => { if (doc._id.anio > maxAnio) maxAnio = doc._id.anio; });

    let companyTotalSalesLatestYear = 0;
    Object.values(canalData).forEach(yearsArray => {
      const latest = yearsArray.find(y => y.anio === maxAnio);
      if (latest) companyTotalSalesLatestYear += latest.ingresos;
    });

    const finalData = [];
    Object.keys(canalData).forEach(c => {
      const yearsArray = canalData[c];
      const latest = yearsArray.find(y => y.anio === maxAnio) || { ingresos: 0, clientesUnicos: 0 };
      const previous = yearsArray.find(y => y.anio === maxAnio - 1) || { ingresos: 0, clientesUnicos: 0 };

      let crecimientoVentas = 0;
      if (previous.ingresos > 0) {
        crecimientoVentas = ((latest.ingresos - previous.ingresos) / previous.ingresos) * 100;
      } else if (latest.ingresos > 0 && previous.ingresos === 0) {
        crecimientoVentas = 100;
      }

      let participacion = 0;
      if (companyTotalSalesLatestYear > 0) {
        participacion = (latest.ingresos / companyTotalSalesLatestYear) * 100;
      }

      if (latest.ingresos > 0 || previous.ingresos > 0) {
        finalData.push({
          canal: c,
          participacion: parseFloat(participacion.toFixed(2)),
          crecimientoVentas: parseFloat(crecimientoVentas.toFixed(2)),
          clientesUnicos: latest.clientesUnicos,
          ingresosTotales: latest.ingresos
        });
      }
    });

    res.json(finalData);
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
    delete matchProps['Canal.TipoCanal'];
    delete matchProps['Tiempo.Mes'];
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
    delete matchProps['Canal.TipoCanal'];
    
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

// 1. Profit Structure Breakdown (Stacked Bar)
exports.getProfitStructure = async (req, res) => {
  try {
    const matchProps = buildMatch(req.query);
    delete matchProps['Ubicacion.Region'];
    
    const pipeline = [];
    if (Object.keys(matchProps).length > 0) pipeline.push({ $match: matchProps });

    pipeline.push(
      {
        $group: {
          _id: "$Producto.Categoria",
          ingresoTotal: { $sum: "$IngresoTotal" },
          costoProduccion: { $sum: "$CostoProducto" },
          costoLogistico: { $sum: "$CostoLogistico" },
          descuentos: { $sum: "$DescuentoAplicado" },
          margenNeto: { $sum: "$MargenNeto" }
        }
      },
      { $sort: { ingresoTotal: -1 } }
    );
    const data = await FactVentas.aggregate(pipeline);
    res.json(data);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

// 2. Logistics Cost Ratio by Category and Method (Grouped Bar)
exports.getLogisticsByCategoryAndMethod = async (req, res) => {
  try {
    const matchProps = buildMatch(req.query);
    delete matchProps['Ubicacion.Region'];
    
    const pipeline = [];
    if (Object.keys(matchProps).length > 0) pipeline.push({ $match: matchProps });

    pipeline.push(
      {
        $group: {
          _id: {
            metodoEnvio: "$MetodoEnvio.NombreMetodoEnvio",
            categoria: "$Producto.Categoria"
          },
          costoLogistico: { $sum: "$CostoLogistico" },
          ingresoTotal: { $sum: "$IngresoTotal" }
        }
      },
      {
        $project: {
          ratio: {
            $cond: [
              { $eq: ["$ingresoTotal", 0] },
              0,
              { $multiply: [{ $divide: ["$costoLogistico", "$ingresoTotal"] }, 100] }
            ]
          }
        }
      },
      {
        $group: {
          _id: "$_id.metodoEnvio",
          categorias: {
            $push: {
              k: "$_id.categoria",
              v: "$ratio"
            }
          }
        }
      },
      {
        $project: {
          _id: 1,
          categorias: { $arrayToObject: "$categorias" }
        }
      }
    );
    const data = await FactVentas.aggregate(pipeline);
    // Flatten result for simple Recharts map: { _id: "Cargo 5", Bikes: 3.5, Components: 2.1 }
    const flatData = data.map(d => ({ method: d._id, ...d.categorias }));
    res.json(flatData);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

// 3. Supplier Lead Time vs Unit Cost (Scatter Plot)
exports.getSupplierCostVsLeadTime = async (req, res) => {
  try {
    const matchProps = buildMatch(req.query);
    delete matchProps['Ubicacion.Region'];
    delete matchProps['Canal.TipoCanal'];
    delete matchProps['Tiempo.Mes'];
    
    const pipeline = [];
    if (Object.keys(matchProps).length > 0) pipeline.push({ $match: matchProps });

    pipeline.push(
      {
        $group: {
          _id: "$Proveedor.NombreProveedor",
          leadTime: { $avg: "$TiempoEntregaDias" },
          costoUnitario: { $avg: "$CostoUnitarioCompra" },
          volumenTotal: { $sum: "$CantidadComprada" }
        }
      },
      { $match: { volumenTotal: { $gt: 0 } } },
      { $sort: { volumenTotal: -1 } },
      { $limit: 30 } // Keep bubble chart from becoming too overloaded
    );
    const data = await FactAbastecimiento.aggregate(pipeline);
    res.json(data);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

// 4. Inventory vs Sales Trend (Over Time)
exports.getInventoryTrend = async (req, res) => {
  try {
    const matchProps = buildMatch(req.query);
    delete matchProps['Ubicacion.Region'];
    delete matchProps['Canal.TipoCanal'];
    
    const pipeline = [];
    if (Object.keys(matchProps).length > 0) pipeline.push({ $match: matchProps });
    
    pipeline.push(
      {
        $group: {
          _id: {
            anio: "$Tiempo.Anio",
            mes: "$Tiempo.Mes"
          },
          stockPromedio: { $avg: "$StockFinal" },
          ventasTotales: { $sum: "$VentasPeriodo" }
        }
      },
      {
        $project: {
          _id: 0,
          anio: "$_id.anio",
          mes: "$_id.mes",
          stockPromedio: 1,
          ventasTotales: 1
        }
      },
      { $sort: { "anio": 1, "mes": 1 } }
    );
    
    const data = await FactInventario.aggregate(pipeline);
    
    const formattedData = data.map(d => ({
       periodo: `${d.anio}-${String(d.mes).padStart(2, '0')}`,
       stockPromedio: Math.round(d.stockPromedio),
       ventasTotales: d.ventasTotales
    }));
    
    res.json(formattedData);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

// 5. Stock vs Sales Matrix (Scatter Plot)
exports.getStockVsSalesMatrix = async (req, res) => {
  try {
    const matchProps = buildMatch(req.query);
    delete matchProps['Ubicacion.Region'];
    delete matchProps['Canal.TipoCanal'];
    
    const pipeline = [];
    if (Object.keys(matchProps).length > 0) pipeline.push({ $match: matchProps });
    
    pipeline.push(
      {
        $group: {
          _id: "$Producto.ProductoKey",
          nombreProducto: { $first: "$Producto.NombreProducto" },
          categoria: { $first: "$Producto.Categoria" },
          stockPromedio: { $avg: "$StockFinal" },
          ventasTotales: { $sum: "$VentasPeriodo" }
        }
      },
      { $match: { $or: [{stockPromedio: { $gt: 0 }}, {ventasTotales: { $gt: 0 }}] } },
      { $project: {
          _id: 0,
          id: "$_id",
          nombreProducto: 1,
          categoria: 1,
          stockPromedio: { $round: ["$stockPromedio", 2] },
          ventasTotales: 1
      }}
    );
    
    const data = await FactInventario.aggregate(pipeline);
    res.json(data);
  } catch (error) { res.status(500).json({ error: error.message }); }
};
