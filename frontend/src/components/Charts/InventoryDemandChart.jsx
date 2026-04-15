import React, { useEffect, useState } from 'react';
import { ComposedChart, Area, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getInventoryMisalignment } from '../../services/api';
import { useFilters } from '../../context/FilterContext';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1A1A1A] border border-white/10 p-4 rounded-xl shadow-2xl backdrop-blur-xl">
        <p className="text-slate-300 text-xs font-semibold mb-3 border-b border-white/10 pb-2">{label}</p>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-violet-500"></div>
              <span className="text-slate-400 text-xs">Avg Stock</span>
            </div>
            <span className="text-white text-sm font-medium">{payload[0].value.toLocaleString()} units</span>
          </div>
          <div className="flex items-center justify-between gap-6">
             <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
              <span className="text-slate-400 text-xs">Demand</span>
            </div>
            <span className="text-white text-sm font-medium">{payload[1]?.value?.toLocaleString() || 0} units</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const InventoryDemandChart = () => {
  const { filters } = useFilters();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getInventoryMisalignment(filters).then(res => {
      const transformed = res.data.slice(0, 10).map(d => ({
        name: d.nombreProducto.substring(0, 15) + (d.nombreProducto.length > 15 ? '...' : ''),
        stock: d.stockPromedio,
        demand: d.ventasTotales
      }));
      setData(transformed);
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
          <h3 className="text-base font-semibold text-white tracking-tight">Inventory vs Demand</h3>
          <p className="text-xs text-slate-500 mt-1">Stock levels across facilities</p>
        </div>
        <button className="text-xs font-medium text-slate-400 px-3 py-1.5 rounded-lg border border-white/5 hover:bg-white/5 hover:text-white transition-all">
          Manage Stock
        </button>
      </div>
      
      <div className="h-80 w-full">
        {loading ? (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <div className="w-8 h-8 rounded-full border-2 border-white/10 border-t-violet-500 animate-spin mb-3"></div>
            <p className="text-sm text-slate-500">Loading metrics...</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ top: 0, right: 0, left: -10, bottom: 0 }}>
               <defs>
                <linearGradient id="colorStock" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorDemand" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#34d399" stopOpacity={0.5}/>
                  <stop offset="95%" stopColor="#34d399" stopOpacity={0}/>
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
                 angle={-20} 
                 textAnchor="end"
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
               <Tooltip content={<CustomTooltip />} cursor={{ fill: '#ffffff', opacity: 0.02 }} />
               <Legend 
                 wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }} 
                 iconType="circle"
               />
               <Bar 
                 yAxisId="left" 
                 dataKey="stock" 
                 fill="url(#colorStock)" 
                 radius={[4, 4, 0, 0]} 
                 name="Avg Stock" 
                 maxBarSize={30}
               />
               <Area 
                 yAxisId="right" 
                 type="monotone" 
                 dataKey="demand" 
                 stroke="#10b981" 
                 strokeWidth={2}
                 fill="url(#colorDemand)"
                 name="Total Demand" 
               />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};
export default InventoryDemandChart;
