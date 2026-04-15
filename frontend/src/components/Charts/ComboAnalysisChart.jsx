import React, { useEffect, useState } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ZAxis, Cell } from 'recharts';
import { getProductCombos } from '../../services/api';
import { useFilters } from '../../context/FilterContext';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-[#1A1A1A] border border-white/10 p-3 rounded-xl shadow-2xl backdrop-blur-xl">
        <p className="text-slate-300 text-xs font-semibold mb-2">Combo Key: {data._id}</p>
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between gap-4">
            <span className="text-slate-400 text-xs">Total Revenue:</span>
            <span className="text-white text-sm font-bold">${data.ingresoTotal.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-slate-400 text-xs">Net Margin:</span>
            <span className="text-emerald-400 text-sm font-bold">${data.margenNeto.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between gap-4 mt-1 border-t border-white/5 pt-1">
            <span className="text-slate-400 text-xs">Units Sold:</span>
            <span className="text-cyan-400 text-sm font-bold">{data.cantidadVendida} units</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const ComboAnalysisChart = () => {
  const { filters } = useFilters();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getProductCombos(filters).then(res => {
      setData(res.data);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, [filters]);

  return (
    <div className="bg-[#111111] border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all duration-300 group">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-base font-semibold text-white tracking-tight">Top Product Bundles</h3>
          <p className="text-xs text-slate-500 mt-1">Margin vs Revenue (Bubble size: Volume)</p>
        </div>
      </div>
      
      <div className="h-80 w-full">
        {loading ? (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <div className="w-8 h-8 rounded-full border-2 border-white/10 border-t-rose-500 animate-spin mb-3"></div>
            <p className="text-sm text-slate-500">Loading combos...</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 0, right: 20, left: -10, bottom: 0 }}>
               <CartesianGrid strokeDasharray="4 4" stroke="#ffffff" strokeOpacity={0.05} vertical={false} />
               <XAxis type="number" dataKey="ingresoTotal" name="Revenue" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val/1000}k`} />
               <YAxis type="number" dataKey="margenNeto" name="Margin" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val/1000}k`} />
               <ZAxis type="number" dataKey="cantidadVendida" range={[50, 400]} name="Volume" />
               <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltip />} />
               <Scatter name="Combos" data={data}>
                 {data.map((entry, index) => (
                   <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#ec4899' : '#8b5cf6'} fillOpacity={0.8} />
                 ))}
               </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default ComboAnalysisChart;
