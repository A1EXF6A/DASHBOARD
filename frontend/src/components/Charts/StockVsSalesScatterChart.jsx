import React, { useEffect, useState } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ZAxis } from 'recharts';
import { getStockVsSalesMatrix } from '../../services/api';
import { useFilters } from '../../context/FilterContext';
import { useLanguage } from '../../context/LanguageContext';

const CustomTooltip = ({ active, payload }) => {
  const { t } = useLanguage();
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-[#1A1A1A] border border-white/10 p-3 rounded-xl shadow-2xl backdrop-blur-xl z-50">
        <p className="text-slate-200 text-xs font-bold mb-2 break-words max-w-[200px]">{data.nombreProducto}</p>
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between gap-6">
            <span className="text-slate-400 text-xs">{t('inv_stock')}:</span>
            <span className="text-cyan-400 text-sm font-bold">{data.stockPromedio?.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between gap-6 pb-1">
            <span className="text-slate-400 text-xs">{t('inv_demand')}:</span>
            <span className="text-purple-400 text-sm font-bold">{data.ventasTotales?.toLocaleString()}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const StockVsSalesScatterChart = () => {
  const { filters } = useFilters();
  const { t } = useLanguage();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getStockVsSalesMatrix(filters).then(res => {
      // Filter out extreme outliers just for presentation or limit properly
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
          <h3 className="text-base font-semibold text-white tracking-tight">{t('inv_scat_title')}</h3>
          <p className="text-xs text-slate-500 mt-1">{t('inv_scat_subtitle')}</p>
        </div>
      </div>
      
      <div className="h-72 w-full">
        {loading ? (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <div className="w-8 h-8 rounded-full border-2 border-white/10 border-t-emerald-500 animate-spin mb-3"></div>
            <p className="text-sm text-slate-500">{t('loading')}</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 10, right: 10, bottom: 0, left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff" strokeOpacity={0.05} />
              <XAxis 
                type="number" 
                dataKey="stockPromedio" 
                name={t('inv_stock')}
                stroke="#64748b" 
                fontSize={11} 
                tickLine={false} 
                axisLine={false}
                tickFormatter={(value) => value.toLocaleString()}
              />
              <YAxis 
                type="number" 
                dataKey="ventasTotales" 
                name={t('inv_demand')}
                stroke="#64748b" 
                fontSize={11} 
                tickLine={false} 
                axisLine={false}
                tickFormatter={(value) => value.toLocaleString()}
              />
              <ZAxis type="number" range={[50, 200]} />
              <Tooltip cursor={{ strokeDasharray: '3 3', stroke: '#cbd5e1', strokeOpacity: 0.2 }} content={<CustomTooltip />} />
              <Scatter 
                name="Products" 
                data={data} 
                fill="#10b981" 
                fillOpacity={0.7}
                stroke="#059669"
                strokeWidth={1}
              />
            </ScatterChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default StockVsSalesScatterChart;
