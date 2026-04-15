import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

export const getProfitability = () => api.get('/rentabilidad-producto');
export const getProductCombos = () => api.get('/combinaciones-productos');
export const getInventoryMisalignment = () => api.get('/desalineacion-inventario');
export const getTerritoryGrowth = () => api.get('/crecimiento-territorio');
export const getTransportCosts = () => api.get('/costos-transporte');
export const getSupplierLeadTimes = () => api.get('/proveedores-tiempo-entrega');
export const getComponentsDistribution = () => api.get('/componentes-producto');

export default api;
