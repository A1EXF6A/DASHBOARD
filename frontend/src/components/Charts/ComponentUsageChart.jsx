import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { getComponentsDistribution } from '../../services/api';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-[#1A1A1A] border border-white/10 p-3 rounded-xl shadow-2xl backdrop-blur-xl">
        <p className="text-slate-300 text-xs font-semibold mb-2">{data._id}</p>
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between gap-6">
            <span className="text-slate-400 text-xs">Total Components:</span>
            <span className="text-white text-sm font-bold">{data.totalComponentes.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between gap-6">
            <span className="text-slate-400 text-xs">Units Mfc:</span>
            <span className="text-cyan-400 text-sm font-bold">{data.unidadesFabricadas.toLocaleString()}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const COLORS = ['#0ea5e9', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#6366f1'];

const ComponentUsageChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getComponentsDistribution().then(res => {
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
          <h3 className="text-base font-semibold text-white tracking-tight">Component Distribution</h3>
          <p className="text-xs text-slate-500 mt-1">Usage per Category</p>
        </div>
      </div>
      
      <div className="h-80 w-full">
        {loading ? (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <div className="w-8 h-8 rounded-full border-2 border-white/10 border-t-emerald-500 animate-spin mb-3"></div>
            <p className="text-sm text-slate-500">Loading components...</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
               <Tooltip content={<CustomTooltip />} />
               <Legend wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }} />
               <Pie
                 data={data}
                 cx="50%"
                 cy="45%"
                 innerRadius={60}
                 outerRadius={100}
                 stroke="none"
                 paddingAngle={4}
                 dataKey="totalComponentes"
                 nameKey="_id"
               >
                 {data.map((entry, index) => (
                   <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                 ))}
               </Pie>
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};
export default ComponentUsageChart;
