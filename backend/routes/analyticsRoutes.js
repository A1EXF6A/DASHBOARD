const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');

router.get('/rentabilidad-producto', analyticsController.getProfitability);
router.get('/combinaciones-productos', analyticsController.getProductCombos);
router.get('/desalineacion-inventario', analyticsController.getInventoryMisalignment);
router.get('/crecimiento-territorio', analyticsController.getTerritoryGrowth);
router.get('/costos-transporte', analyticsController.getTransportCosts);
router.get('/proveedores-tiempo-entrega', analyticsController.getSupplierLeadTimes);
router.get('/componentes-producto', analyticsController.getComponentsDistribution);

module.exports = router;
