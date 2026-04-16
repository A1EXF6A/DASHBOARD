import React, { useEffect, useState } from 'react';
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getInventoryTrend } from '../../services/api';
import { useFilters } from '../../context/FilterContext';
import { useLanguage } from '../../context/LanguageContext';

const CustomTooltip = ({ active, payload, label }) => {
  const { t } = useLanguage();
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1A1A1A] border border-white/10 p-3 rounded-xl shadow-2xl backdrop-blur-xl">
        <p className="text-slate-300 text-xs font-semibold mb-2">{t('inv_trend_period')}: {label}</p>
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between gap-6">
            <span className="text-slate-400 text-xs">{t('inv_stock')}:</span>
            <span className="text-cyan-400 text-sm font-bold">{payload[0]?.value?.toLocaleString()} {t('units')}</span>
          </div>
          <div className="flex items-center justify-between gap-6 pb-1">
            <span className="text-slate-400 text-xs">{t('inv_demand')}:</span>
            <span className="text-purple-400 text-sm font-bold">{payload[1]?.value?.toLocaleString()} {t('units')}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const StockVsSalesTrendChart = () => {
  const { filters } = useFilters();
  const { t } = useLanguage();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getInventoryTrend(filters).then(res => {
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
          <h3 className="text-base font-semibold text-white tracking-tight">{t('inv_trend_title')}</h3>
          <p className="text-xs text-slate-500 mt-1">{t('inv_trend_subtitle')}</p>
        </div>
      </div>
      
      <div className="h-72 w-full">
        {loading ? (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <div className="w-8 h-8 rounded-full border-2 border-white/10 border-t-purple-500 animate-spin mb-3"></div>
            <p className="text-sm text-slate-500">{t('loading')}</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ top: 0, right: 0, left: -10, bottom: 0 }}>
               <defs>
                <linearGradient id="colorTrendStock" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
               <CartesianGrid strokeDasharray="4 4" stroke="#ffffff" strokeOpacity={0.05} vertical={false} />
               <XAxis 
                 dataKey="periodo" 
                 stroke="#64748b" 
                 fontSize={11} 
                 tickLine={false} 
                 axisLine={false} 
                 tickMargin={12}
               />
               <YAxis 
                 yAxisId="left" 
                 stroke="#64748b" 
                 fontSize={11} 
                 tickLine={false} 
                 axisLine={false} 
                 tickCount={5}
               />
               <YAxis 
                 yAxisId="right" 
                 orientation="right" 
                 stroke="#64748b" 
                 fontSize={11} 
                 tickLine={false} 
                 axisLine={false} 
                 tickCount={5}
               />
               <Tooltip content={<CustomTooltip />} cursor={{ fill: '#ffffff', opacity: 0.05 }} />
               <Legend 
                 wrapperStyle={{ paddingTop: '10px', fontSize: '11px', color: '#94a3b8' }} 
                 iconType="circle"
               />
               <Bar 
                 yAxisId="left" 
                 dataKey="stockPromedio" 
                 fill="url(#colorTrendStock)" 
                 radius={[4, 4, 0, 0]} 
                 name={t('inv_stock')} 
                 barSize={24}
               />
               <Line 
                 yAxisId="right" 
                 type="monotone" 
                 dataKey="ventasTotales" 
                 stroke="#a855f7" 
                 strokeWidth={3}
                 dot={{ fill: '#a855f7', strokeWidth: 2, r: 4, stroke: '#111' }}
                 activeDot={{ r: 6, strokeWidth: 0 }}
                 name={t('inv_demand')} 
               />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default StockVsSalesTrendChart;
