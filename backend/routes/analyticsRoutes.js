const express = require('express');
const router = express.Router();
const { 
  getProfitability, 
  getProductCombos, 
  getInventoryMisalignment, 
  getTerritoryGrowth, 
  getTransportCosts, 
  getSupplierLeadTimes, 
  getComponentsDistribution,
  getProfitStructure,
  getLogisticsByCategoryAndMethod,
  getSupplierCostVsLeadTime,
  getTerritoryMatrix
} = require('../controllers/analyticsController');

router.get('/rentabilidad-producto', getProfitability);
router.get('/combinaciones-productos', getProductCombos);
router.get('/desalineacion-inventario', getInventoryMisalignment);
router.get('/crecimiento-territorio', getTerritoryGrowth);
router.get('/costos-transporte', getTransportCosts);
router.get('/proveedores-tiempo-entrega', getSupplierLeadTimes);
router.get('/componentes-producto', getComponentsDistribution);

// Nuevos endpoints avanzados
router.get('/profit-structure', getProfitStructure);
router.get('/logistics-by-category', getLogisticsByCategoryAndMethod);
router.get('/supplier-cost-vs-leadtime', getSupplierCostVsLeadTime);
router.get('/territory-matrix', getTerritoryMatrix);

module.exports = router;
