import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getTerritoryGrowth } from '../../services/api';
import { useFilters } from '../../context/FilterContext';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const dateStr = `${data._id.mes}/${data._id.anio} - ${data._id.canal}`;
    return (
      <div className="bg-[#1A1A1A] border border-white/10 p-3 rounded-xl shadow-2xl backdrop-blur-xl">
        <p className="text-slate-300 text-xs font-semibold mb-2">{dateStr}</p>
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between gap-6">
            <span className="text-slate-400 text-xs">Total Revenue:</span>
            <span className="text-white text-sm font-bold">${data.ingresos.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between gap-6 pb-1">
            <span className="text-slate-400 text-xs">Unique Clients:</span>
            <span className="text-cyan-400 text-sm font-bold">{data.clientesUnicos}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const TerritoryGrowthChart = () => {
  const { filters } = useFilters();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getTerritoryGrowth(filters).then(res => {
      // Formatear la fecha para visibilidad
      const transformed = res.data.map(d => ({
         ...d,
         period: `${d._id.anio}-${d._id.mes.toString().padStart(2, '0')}`
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
          <h3 className="text-base font-semibold text-white tracking-tight">Channel & Territory Growth</h3>
          <p className="text-xs text-slate-500 mt-1">Revenue trend over time</p>
        </div>
      </div>
      
      <div className="h-80 w-full">
        {loading ? (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <div className="w-8 h-8 rounded-full border-2 border-white/10 border-t-purple-500 animate-spin mb-3"></div>
            <p className="text-sm text-slate-500">Loading growth metrics...</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
               <defs>
                <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                </linearGradient>
              </defs>
               <CartesianGrid strokeDasharray="4 4" stroke="#ffffff" strokeOpacity={0.05} vertical={false} />
               <XAxis 
                 dataKey="period" 
                 stroke="#64748b" 
                 fontSize={10} 
                 tickLine={false} 
                 axisLine={false} 
                 tickMargin={10}
               />
               <YAxis 
                  stroke="#64748b" 
                  fontSize={11} 
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(val) => `$${(val/1000).toFixed(0)}k`} 
               />
               <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#ffffff', strokeOpacity: 0.1, strokeWidth: 2 }} />
               <Area type="monotone" dataKey="ingresos" stroke="#a855f7" strokeWidth={3} fillOpacity={1} fill="url(#colorGrowth)" />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};
export default TerritoryGrowthChart;
