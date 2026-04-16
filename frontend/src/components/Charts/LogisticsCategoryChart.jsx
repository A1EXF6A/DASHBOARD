import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { getLogisticsByCategory } from '../../services/api';
import { useFilters } from '../../context/FilterContext';
import { useLanguage } from '../../context/LanguageContext';

const CustomTooltip = ({ active, payload, label }) => {
  const { t } = useLanguage();
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1A1A1A] border border-white/10 p-3 rounded-xl shadow-2xl backdrop-blur-xl">
        <p className="text-slate-300 text-xs font-semibold mb-2">{label}</p>
        <div className="flex flex-col gap-1.5 border-t border-white/10 pt-1.5 mt-1.5">
          {payload.map((entry, index) => (
             <div key={index} className="flex items-center justify-between gap-6">
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></div>
                   <span className="text-slate-400 text-xs">{entry.name}</span>
                </div>
                <span className="text-white text-sm font-bold">{parseFloat(entry.value).toFixed(2)}%</span>
             </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

const LogisticsCategoryChart = () => {
  const { filters } = useFilters();
  const { t } = useLanguage();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Derive all unique project categories to create Bars dynamically
  const [categories, setCategories] = useState([]);
  const COLORS = ['#0ea5e9', '#ec4899', '#f59e0b', '#10b981', '#a855f7'];

  useEffect(() => {
    setLoading(true);
    getLogisticsByCategory(filters).then(res => {
      setData(res.data);
      // Auto-identify all product categories from the payload keys
      const allKeys = new Set();
      res.data.forEach(item => {
        Object.keys(item).forEach(key => {
          if (key !== 'method') allKeys.add(key);
        });
      });
      setCategories(Array.from(allKeys));
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
          <h3 className="text-base font-semibold text-white tracking-tight">{t('log_cat_title')}</h3>
          <p className="text-xs text-slate-500 mt-1">{t('log_cat_subtitle')}</p>
        </div>
      </div>
      
      <div className="h-72 w-full">
        {loading ? (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <div className="w-8 h-8 rounded-full border-2 border-white/10 border-t-pink-500 animate-spin mb-3"></div>
            <p className="text-sm text-slate-500">{t('loading')}</p>
          </div>
        ) : (!data || data.length === 0) ? (
          <div className="w-full h-full flex flex-col items-center justify-center px-6 text-center">
            <p className="text-sm text-slate-500">{t('no_data')}</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 30, left: -20, bottom: 0 }}>
               <CartesianGrid strokeDasharray="4 4" stroke="#ffffff" strokeOpacity={0.05} vertical={false} />
               <XAxis dataKey="method" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
               <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val) => `${val}%`} />
               <Tooltip cursor={{ fill: '#ffffff', opacity: 0.03 }} content={<CustomTooltip />} />
               <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '11px', color: '#94a3b8' }} />
               {categories.map((cat, index) => (
                  <Bar key={cat} dataKey={cat} fill={COLORS[index % COLORS.length]} radius={[4, 4, 0, 0]} />
               ))}
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};
export default LogisticsCategoryChart;
