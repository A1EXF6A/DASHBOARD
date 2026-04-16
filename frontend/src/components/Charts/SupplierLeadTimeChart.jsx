import React, { useEffect, useState } from 'react';
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getSupplierLeadTimes } from '../../services/api';
import { useFilters } from '../../context/FilterContext';
import { useLanguage } from '../../context/LanguageContext';

const CustomTooltip = ({ active, payload, label }) => {
  const { t } = useLanguage();
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1A1A1A] border border-white/10 p-3 rounded-xl shadow-2xl backdrop-blur-xl">
        <p className="text-slate-300 text-xs font-semibold mb-3 border-b border-white/10 pb-2">{label}</p>
        <div className="flex flex-col gap-2">
           <div className="flex items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-cyan-500"></div>
              <span className="text-slate-400 text-xs">{t('sup_spend')}</span>
            </div>
            <span className="text-white text-sm font-bold">${payload[0]?.value?.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-rose-500"></div>
              <span className="text-slate-400 text-xs">{t('sup_lead')}</span>
            </div>
            <span className="text-rose-400 text-sm font-bold">{payload[1]?.value?.toFixed(1)} {t('days')}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const SupplierLeadTimeChart = () => {
  const { filters } = useFilters();
  const { t } = useLanguage();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getSupplierLeadTimes(filters).then(res => {
      setData(res.data.slice(0, 8)); // Top 8 suppliers
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
          <h3 className="text-base font-semibold text-white tracking-tight">{t('sup_title')}</h3>
          <p className="text-xs text-slate-500 mt-1">{t('sup_subtitle')}</p>
        </div>
      </div>
      
      <div className="h-72 w-full">
        {loading ? (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <div className="w-8 h-8 rounded-full border-2 border-white/10 border-t-cyan-500 animate-spin mb-3"></div>
            <p className="text-sm text-slate-500">{t('loading')}</p>
          </div>
        ) : (!data || data.length === 0) ? (
          <div className="w-full h-full flex flex-col items-center justify-center px-6 text-center">
            <p className="text-sm text-slate-500">{t('no_data')}</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ top: 0, right: 10, left: 0, bottom: 20 }}>
               <CartesianGrid strokeDasharray="4 4" stroke="#ffffff" strokeOpacity={0.05} vertical={false} />
               <XAxis 
                 dataKey="_id" 
                 stroke="#64748b" 
                 fontSize={10} 
                 tickLine={false} 
                 axisLine={false} 
                 interval={0}
                 angle={-25} 
                 textAnchor="end"
                 tickFormatter={(val) => val.length > 12 ? val.substring(0,12) + '...' : val}
               />
               <YAxis yAxisId="left" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val) => `$${(val/1000).toFixed(0)}k`} />
               <YAxis yAxisId="right" orientation="right" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
               <Tooltip content={<CustomTooltip />} cursor={{ fill: '#ffffff', opacity: 0.02 }} />
               <Legend wrapperStyle={{ paddingTop: '15px', fontSize: '11px' }} />
               <Bar yAxisId="left" dataKey="costoTotal" name={t('sup_spend')} fill="#06b6d4" fillOpacity={0.7} radius={[4, 4, 0, 0]} maxBarSize={30} />
               <Line yAxisId="right" type="monotone" dataKey="tiempoEntregaPromedio" name={t('sup_lead')} stroke="#f43f5e" strokeWidth={3} dot={{ r: 4, fill: '#f43f5e', strokeWidth: 2 }} />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};
export default SupplierLeadTimeChart;
