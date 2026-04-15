import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

export const getProfitability = (filters) => api.get('/rentabilidad-producto', { params: filters });
export const getProductCombos = (filters) => api.get('/combinaciones-productos', { params: filters });
export const getInventoryMisalignment = (filters) => api.get('/desalineacion-inventario', { params: filters });
export const getTerritoryGrowth = (filters) => api.get('/crecimiento-territorio', { params: filters });
export const getTransportCosts = (filters) => api.get('/costos-transporte', { params: filters });
export const getSupplierLeadTimes = (filters) => api.get('/proveedores-tiempo-entrega', { params: filters });
export const getComponentsDistribution = (filters) => api.get('/componentes-producto', { params: filters });

export default api;
