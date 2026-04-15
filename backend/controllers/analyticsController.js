const { FactVentas, FactVentasCombo, FactInventario, FactFabricacion, FactDistribucion, FactAbastecimiento } = require('../models');

exports.getProfitability = async (req, res) => {
  try {
    const data = await FactVentas.aggregate([
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
    ]);
    res.json(data);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

exports.getProductCombos = async (req, res) => {
  try {
    const data = await FactVentasCombo.aggregate([
      {
        $group: {
          _id: "$ComboProducto.ComboProductoKey",
          ingresoTotal: { $sum: "$IngresoTotal" },
          margenNeto: { $sum: "$MargenNeto" },
          cantidadVendida: { $sum: { $add: ["$CantidadProducto1", "$CantidadProducto2"] } }
        }
      },
      { $sort: { margenNeto: -1 } },
      { $limit: 20 }
    ]);
    res.json(data);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

exports.getInventoryMisalignment = async (req, res) => {
  try {
    const data = await FactInventario.aggregate([
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
    ]);
    res.json(data);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

exports.getTerritoryGrowth = async (req, res) => {
  try {
    const data = await FactVentas.aggregate([
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
    ]);
    res.json(data);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

exports.getTransportCosts = async (req, res) => {
  try {
    const data = await FactVentas.aggregate([
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
    ]);
    res.json(data);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

exports.getSupplierLeadTimes = async (req, res) => {
  try {
    const data = await FactAbastecimiento.aggregate([
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
    ]);
    res.json(data);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

exports.getComponentsDistribution = async (req, res) => {
  try {
    const data = await FactFabricacion.aggregate([
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
    ]);
    res.json(data);
  } catch (error) { res.status(500).json({ error: error.message }); }
};
