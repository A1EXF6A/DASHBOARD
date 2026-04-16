import React, { useEffect, useState } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ZAxis, Cell } from 'recharts';
import { getSupplierCostVsLeadTime } from '../../services/api';
import { useFilters } from '../../context/FilterContext';
import { useLanguage } from '../../context/LanguageContext';

const CustomTooltip = ({ active, payload }) => {
  const { t } = useLanguage();
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-[#1A1A1A] border border-white/10 p-3 rounded-xl shadow-2xl backdrop-blur-xl">
        <p className="text-slate-300 text-xs font-semibold mb-2">{data._id}</p>
        <div className="flex flex-col gap-1.5 border-t border-white/10 pt-1.5 mt-1.5">
          <div className="flex items-center justify-between gap-6">
            <span className="text-slate-400 text-xs">{t('sup_lead')}:</span>
            <span className="text-teal-400 text-sm font-bold">{parseFloat(data.leadTime).toFixed(1)} {t('days')}</span>
          </div>
          <div className="flex items-center justify-between gap-6 pb-1">
            <span className="text-slate-400 text-xs">{t('sup_scat_cost')}:</span>
            <span className="text-white text-sm font-bold">${parseFloat(data.costoUnitario).toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between gap-6 pb-1">
            <span className="text-slate-400 text-xs">{t('sup_scat_vol')}:</span>
            <span className="text-indigo-400 text-sm font-bold">{data.volumenTotal.toLocaleString()}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const COLORS = ['#ef4444', '#f97316', '#f59e0b', '#84cc16', '#10b981', '#06b6d4', '#3b82f6', '#8b5cf6'];

const SupplierCostScatterChart = () => {
  const { filters } = useFilters();
  const { t } = useLanguage();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getSupplierCostVsLeadTime(filters).then(res => {
      setData(res.data);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, [filters]);

  return (
    <div className="bg-[#111111] border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all duration-300 group h-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-base font-semibold text-white tracking-tight">{t('sup_scat_title')}</h3>
          <p className="text-xs text-slate-500 mt-1">{t('sup_scat_subtitle')}</p>
        </div>
      </div>
      
      <div className="h-72 w-full">
        {loading ? (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <div className="w-8 h-8 rounded-full border-2 border-white/10 border-t-teal-500 animate-spin mb-3"></div>
            <p className="text-sm text-slate-500">{t('loading')}</p>
          </div>
        ) : (!data || data.length === 0) ? (
          <div className="w-full h-full flex flex-col items-center justify-center px-6 text-center">
            <p className="text-sm text-slate-500">{t('no_data')}</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 10, right: 20, left: -20, bottom: 10 }}>
               <CartesianGrid strokeDasharray="4 4" stroke="#ffffff" strokeOpacity={0.05} />
               <XAxis 
                 type="number" 
                 dataKey="leadTime" 
                 name="Lead Time" 
                 stroke="#64748b" 
                 fontSize={11} 
                 tickLine={false} 
                 axisLine={false} 
                 tickFormatter={(val) => `${val}d`} 
               />
               <YAxis 
                 type="number" 
                 dataKey="costoUnitario" 
                 name="Unit Cost" 
                 stroke="#64748b" 
                 fontSize={11} 
                 tickLine={false} 
                 axisLine={false} 
                 tickFormatter={(val) => `$${val}`} 
               />
               <ZAxis 
                  type="number" 
                  dataKey="volumenTotal" 
                  range={[100, 800]} 
                  name="Volume" 
               />
               <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltip />} />
               <Scatter name="Suppliers" data={data}>
                 {data.map((entry, index) => (
                   <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} fillOpacity={0.8} />
                 ))}
               </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};
export default SupplierCostScatterChart;
