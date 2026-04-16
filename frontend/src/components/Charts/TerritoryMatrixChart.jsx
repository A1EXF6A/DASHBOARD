import React, { useEffect, useState } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ZAxis, Cell } from 'recharts';
import { getTerritoryMatrix } from '../../services/api';
import { useFilters } from '../../context/FilterContext';
import { useLanguage } from '../../context/LanguageContext';

const CustomTooltip = ({ active, payload }) => {
  const { t } = useLanguage();
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-[#1A1A1A] border border-white/10 p-3 rounded-xl shadow-2xl backdrop-blur-xl">
        <p className="text-slate-300 text-xs font-semibold mb-2">{data.canal}</p>
        <div className="flex flex-col gap-1.5 border-t border-white/10 pt-1.5 mt-1.5">
          <div className="flex items-center justify-between gap-6">
            <span className="text-slate-400 text-xs">{t('terr_part')}:</span>
            <span className="text-cyan-400 text-sm font-bold">{data.participacion}%</span>
          </div>
          <div className="flex items-center justify-between gap-6 pb-1">
            <span className="text-slate-400 text-xs">{t('terr_growth')}:</span>
            <span className={`${data.crecimientoVentas >= 0 ? 'text-emerald-400' : 'text-rose-400'} text-sm font-bold`}>
               {data.crecimientoVentas > 0 && '+'}{data.crecimientoVentas}%
            </span>
          </div>
          <div className="flex items-center justify-between gap-6 pb-1">
            <span className="text-slate-400 text-xs">{t('terr_clients')}:</span>
            <span className="text-white text-sm font-bold">{data.clientesUnicos.toLocaleString()}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const COLORS = ['#a855f7', '#0ea5e9', '#ec4899', '#f59e0b', '#10b981', '#6366f1'];

const TerritoryMatrixChart = () => {
  const { filters } = useFilters();
  const { t } = useLanguage();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getTerritoryMatrix(filters).then(res => {
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
          <h3 className="text-base font-semibold text-white tracking-tight">{t('terr_matrix_title')}</h3>
          <p className="text-xs text-slate-500 mt-1">{t('terr_matrix_subtitle')}</p>
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
            <ScatterChart margin={{ top: 10, right: 20, left: -20, bottom: 10 }}>
               <CartesianGrid strokeDasharray="4 4" stroke="#ffffff" strokeOpacity={0.05} />
               <XAxis 
                 type="number" 
                 dataKey="participacion" 
                 name="Share" 
                 stroke="#64748b" 
                 fontSize={11} 
                 tickLine={false} 
                 axisLine={false} 
                 tickFormatter={(val) => `${val}%`} 
               />
               <YAxis 
                 type="number" 
                 dataKey="crecimientoVentas" 
                 name="Growth" 
                 stroke="#64748b" 
                 fontSize={11} 
                 tickLine={false} 
                 axisLine={false} 
                 tickFormatter={(val) => `${val}%`} 
               />
               <ZAxis 
                  type="number" 
                  dataKey="clientesUnicos" 
                  range={[100, 800]} 
                  name="Clients" 
               />
               <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltip />} />
               <Scatter name="Territories" data={data}>
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
export default TerritoryMatrixChart;
