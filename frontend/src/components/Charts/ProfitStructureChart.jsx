import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { getProfitStructure } from '../../services/api';
import { useFilters } from '../../context/FilterContext';
import { useLanguage } from '../../context/LanguageContext';

const CustomTooltip = ({ active, payload, label }) => {
  const { t } = useLanguage();
  if (active && payload && payload.length) {
    // Reverse payload so Tooltip matches visual stack order (bottom to top visually vs data array)
    const reversed = [...payload].reverse();
    return (
      <div className="bg-[#1A1A1A] border border-white/10 p-3 rounded-xl shadow-2xl backdrop-blur-xl">
        <p className="text-slate-300 text-xs font-semibold mb-2">{label}</p>
        <div className="flex flex-col gap-1.5 border-t border-white/10 pt-1.5 mt-1.5">
          {reversed.map((entry, index) => (
             <div key={index} className="flex items-center justify-between gap-6">
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></div>
                   <span className="text-slate-400 text-xs">{entry.name}</span>
                </div>
                <span className="text-white text-sm font-bold">${entry.value.toLocaleString()}</span>
             </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

const ProfitStructureChart = () => {
  const { filters } = useFilters();
  const { t } = useLanguage();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getProfitStructure(filters).then(res => {
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
          <h3 className="text-base font-semibold text-white tracking-tight">{t('profit_st_title')}</h3>
          <p className="text-xs text-slate-500 mt-1">{t('profit_st_subtitle')}</p>
        </div>
      </div>
      
      <div className="h-72 w-full">
        {loading ? (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <div className="w-8 h-8 rounded-full border-2 border-white/10 border-t-cyan-500 animate-spin mb-3"></div>
            <p className="text-sm text-slate-500">{t('loading')}</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart layout="vertical" data={data} margin={{ top: 0, right: 30, left: 10, bottom: 0 }}>
               <CartesianGrid strokeDasharray="4 4" stroke="#ffffff" strokeOpacity={0.05} horizontal={false} />
               <XAxis type="number" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val/1000}k`} />
               <YAxis dataKey="_id" type="category" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} width={80} />
               <Tooltip cursor={{ fill: '#ffffff', opacity: 0.03 }} content={<CustomTooltip />} />
               <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '11px', color: '#94a3b8' }} />
               {/* Order matters for stacked bars in recharts (bottom to top) */}
               <Bar dataKey="costoProduccion" stackId="a" fill="#ef4444" name={t('profit_st_production')} barSize={24} />
               <Bar dataKey="costoLogistico" stackId="a" fill="#f59e0b" name={t('profit_st_logistic')} />
               <Bar dataKey="descuentos" stackId="a" fill="#a855f7" name={t('profit_st_discount')} />
               <Bar dataKey="margenNeto" stackId="a" fill="#10b981" name={t('prof_margin')} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};
export default ProfitStructureChart;
