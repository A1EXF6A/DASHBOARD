import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { getTransportCosts } from '../../services/api';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-[#1A1A1A] border border-white/10 p-3 rounded-xl shadow-2xl backdrop-blur-xl">
        <p className="text-slate-300 text-xs font-semibold mb-2">{label}</p>
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between gap-6">
            <span className="text-slate-400 text-xs">Total Logistic Cost:</span>
            <span className="text-white text-sm font-bold">${data.costoLogisticoTotal.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between gap-6">
            <span className="text-slate-400 text-xs">Total Revenue:</span>
            <span className="text-emerald-400 text-sm font-bold">${data.ingresoTotal.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between gap-6 mt-1 border-t border-white/5 pt-1.5">
            <span className="text-slate-400 text-xs">Cost/Revenue Ratio:</span>
            <span className="text-amber-400 text-sm font-bold">{data.ratioCostoVsIngreso.toFixed(2)}%</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const LogisticsCostChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTransportCosts().then(res => {
      setData(res.data);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  return (
    <div className="bg-[#111111] border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all duration-300 group">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-base font-semibold text-white tracking-tight">Logistics Cost Efficiency</h3>
          <p className="text-xs text-slate-500 mt-1">Cost vs Revenue Ratio by Shipping Method</p>
        </div>
      </div>
      
      <div className="h-80 w-full">
        {loading ? (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <div className="w-8 h-8 rounded-full border-2 border-white/10 border-t-amber-500 animate-spin mb-3"></div>
            <p className="text-sm text-slate-500">Loading logistics...</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart layout="vertical" data={data} margin={{ top: 0, right: 30, left: 10, bottom: 0 }}>
               <CartesianGrid strokeDasharray="4 4" stroke="#ffffff" strokeOpacity={0.05} horizontal={false} />
               <XAxis type="number" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val) => `${val}%`} />
               <YAxis dataKey="_id" type="category" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} width={120} tickFormatter={(val) => val.substring(0, 15)} />
               <Tooltip cursor={{ fill: '#ffffff', opacity: 0.03 }} content={<CustomTooltip />} />
               <Bar dataKey="ratioCostoVsIngreso" radius={[0, 4, 4, 0]} barSize={24}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.ratioCostoVsIngreso > 2 ? '#ef4444' : '#f59e0b'} fillOpacity={0.9} />
                  ))}
               </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};
export default LogisticsCostChart;
