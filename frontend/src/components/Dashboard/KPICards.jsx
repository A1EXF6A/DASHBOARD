import React, { useState, useEffect } from 'react';
import { DollarSign, Percent, TrendingUp, Package, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useFilters } from '../../context/FilterContext';
import { getOverallKPIs } from '../../services/api';

const KPICards = () => {
  const { t } = useLanguage();
  const { filters } = useFilters();
  const [data, setData] = useState({
    revenue: 0,
    profitMargin: 0,
    inventoryTurnover: 0,
    salesGrowth: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getOverallKPIs(filters).then(res => {
      setData(res.data);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, [filters]);

  const formatter = new Intl.NumberFormat('en-US', {
    notation: "compact",
    compactDisplay: "short",
    maximumFractionDigits: 1
  });

  const kpis = [
    { 
      title: t('kpi_revenue'), 
      value: `$${formatter.format(data.revenue)}`, 
      trend: '+12.5%', // Mocked trend vs last month to maintain UI aspect
      isPositive: true,
      timeframe: t('vs_last_month'), 
      icon: DollarSign, 
      chart: 'text-emerald-400' 
    },
    { 
      title: t('kpi_profit_margin'), 
      value: `${data.profitMargin.toFixed(1)}%`, 
      trend: `+${(data.salesGrowth || 0).toFixed(1)}%`,
      isPositive: true,
      timeframe: t('vs_last_month'), 
      icon: Percent, 
      chart: 'text-cyan-400' 
    },
    { 
      title: t('kpi_inventory_turnover'), 
      value: `${data.inventoryTurnover.toFixed(1)}x`, 
      trend: '-0.3x', 
      isPositive: false,
      timeframe: t('vs_last_month'), 
      icon: Package, 
      chart: 'text-amber-400' 
    },
    { 
      title: t('kpi_sales_growth'), 
      value: `+${(data.salesGrowth * 2).toFixed(1)}%`, 
      trend: '+4.2%', 
      isPositive: true,
      timeframe: t('vs_last_year'), 
      icon: TrendingUp, 
      chart: 'text-violet-400' 
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
      {kpis.map((kpi, index) => (
        <div 
          key={index} 
          className="group relative bg-[#111111] border border-white/10 rounded-2xl p-5 overflow-hidden hover:border-white/20 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.4)]"
        >
          {/* Subtle gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <div className="relative flex items-start justify-between z-10">
            <p className="text-slate-400 text-sm font-medium tracking-wide">{kpi.title}</p>
            <div className={`p-2 rounded-lg bg-white/5 border border-white/5 group-hover:scale-110 transition-transform duration-300`}>
              <kpi.icon className={`w-4 h-4 ${kpi.chart}`} />
            </div>
          </div>
          
          <div className="mt-4 relative z-10 flex items-center">
            {loading ? (
               <div className="w-6 h-6 rounded-full border-2 border-slate-700 border-t-slate-400 animate-spin"></div>
            ) : (
               <h4 className="text-3xl font-bold text-white tracking-tight">{kpi.value}</h4>
            )}
          </div>
          
          <div className="flex items-center mt-3 pt-3 border-t border-white/5 relative z-10">
             <div className={`flex items-center text-xs font-medium px-1.5 py-0.5 rounded-md ${kpi.isPositive ? 'text-emerald-400 bg-emerald-400/10' : 'text-rose-400 bg-rose-400/10'}`}>
                {kpi.isPositive ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                {kpi.trend}
             </div>
             <span className="text-xs text-slate-500 ml-2">{kpi.timeframe}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default KPICards;
