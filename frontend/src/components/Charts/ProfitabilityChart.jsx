import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { getProfitability } from '../../services/api';
import { useFilters } from '../../context/FilterContext';
import { useLanguage } from '../../context/LanguageContext';

// Custom Tooltip for better SaaS UI design
const CustomTooltip = ({ active, payload, label }) => {
  const { t } = useLanguage();
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1A1A1A] border border-white/10 p-3 rounded-xl shadow-2xl backdrop-blur-xl">
        <p className="text-slate-300 text-xs font-semibold mb-2">{label}</p>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
          <span className="text-slate-400 text-xs">{t('prof_margin')}:</span>
          <span className="text-white text-sm font-bold">${payload[0].value.toLocaleString()}</span>
        </div>
      </div>
    );
  }
  return null;
};

const ProfitabilityChart = () => {
  const { filters } = useFilters();
  const { t } = useLanguage();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getProfitability(filters).then(res => {
      const transformed = res.data.slice(0, 8).map(d => ({
        name: d.nombre.substring(0, 20) + (d.nombre.length > 20 ? '...' : ''),
        margin: d.margenNeto,
        revenue: d.ingresoTotal
      }));
      setData(transformed);
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
          <h3 className="text-base font-semibold text-white tracking-tight">{t('prof_title')}</h3>
          <p className="text-xs text-slate-500 mt-1">{t('prof_subtitle')}</p>
        </div>
        <button className="text-xs font-medium text-cyan-400 bg-cyan-400/10 px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
          {t('btn_report')}
        </button>
      </div>
      
      <div className="h-72 w-full">
        {loading ? (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <div className="w-8 h-8 rounded-full border-2 border-white/10 border-t-cyan-500 animate-spin mb-3"></div>
            <p className="text-sm text-slate-500">{t('loading')}</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 20 }}>
              <defs>
                <linearGradient id="colorMargin" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22d3ee" stopOpacity={1}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.8}/>
                </linearGradient>
                <linearGradient id="colorMarginMuted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#334155" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#1e293b" stopOpacity={0.5}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 4" stroke="#ffffff" strokeOpacity={0.05} vertical={false} />
              <XAxis 
                dataKey="name" 
                stroke="#64748b" 
                fontSize={11} 
                tickLine={false} 
                axisLine={false} 
                tickMargin={12}
                interval={0}
                angle={-30} 
                textAnchor="end" 
              />
              <YAxis 
                stroke="#64748b" 
                fontSize={11} 
                tickLine={false} 
                axisLine={false} 
                tickFormatter={(val) => `$${(val/1000).toFixed(0)}k`} 
                tickCount={6}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#ffffff', opacity: 0.02 }} />
              <Bar dataKey="margin" radius={[4, 4, 0, 0]} maxBarSize={40}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index < 3 ? 'url(#colorMargin)' : 'url(#colorMarginMuted)'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default ProfitabilityChart;
