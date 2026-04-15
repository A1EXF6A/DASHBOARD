import React from 'react';
import { SlidersHorizontal, Search, RotateCcw } from 'lucide-react';
import { useFilters } from '../../context/FilterContext';
import { useLanguage } from '../../context/LanguageContext';

const GlobalFilters = () => {
  const { filters, updateFilter, resetFilters } = useFilters();
  const { t } = useLanguage();

  const hasActiveFilters = filters.anio !== 'All' || filters.region !== 'All' || filters.categoria !== 'All';

  return (
    <div className="bg-[#111111] border border-white/10 rounded-2xl p-4 mb-8 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <div className="relative w-full lg:w-auto">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder={t('search_placeholder')}
            className="bg-[#0A0A0A] border border-white/10 text-white text-sm rounded-lg pl-9 pr-4 py-2 w-full lg:w-80 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all placeholder:text-slate-600"
          />
        </div>
      </div>
      
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center text-slate-400 font-medium text-sm mr-2 hidden xl:flex">
          <SlidersHorizontal className="w-3.5 h-3.5 mr-2" />
          {t('filters_title')}
        </div>
        
        {/* Year Filter */}
        <select 
          className="flex-1 sm:flex-none bg-[#0A0A0A] border border-white/10 rounded-lg px-3.5 py-2 text-sm font-medium text-slate-300 focus:outline-none focus:border-cyan-500 hover:border-white/30 transition-all cursor-pointer appearance-none"
          value={filters.anio}
          onChange={(e) => updateFilter('anio', e.target.value)}
        >
          <option value="All">{t('all_time')}</option>
          <option value="2011">2011</option>
          <option value="2012">2012</option>
          <option value="2013">2013</option>
          <option value="2014">2014</option>
        </select>

        {/* Region Filter */}
        <select 
          className="flex-1 sm:flex-none bg-[#0A0A0A] border border-white/10 rounded-lg px-3.5 py-2 text-sm font-medium text-slate-300 focus:outline-none focus:border-cyan-500 hover:border-white/30 transition-all cursor-pointer appearance-none"
          value={filters.region}
          onChange={(e) => updateFilter('region', e.target.value)}
        >
          <option value="All">{t('all_regions')}</option>
          <option value="North America">{t('north_america')}</option>
          <option value="Europe">{t('europe')}</option>
          <option value="Pacific">{t('pacific')}</option>
        </select>

        {/* Category Filter */}
        <select 
          className="flex-1 sm:flex-none bg-[#0A0A0A] border border-white/10 rounded-lg px-3.5 py-2 text-sm font-medium text-slate-300 focus:outline-none focus:border-cyan-500 hover:border-white/30 transition-all cursor-pointer appearance-none"
          value={filters.categoria}
          onChange={(e) => updateFilter('categoria', e.target.value)}
        >
          <option value="All">{t('all_categories')}</option>
          <option value="Bikes">{t('bikes')}</option>
          <option value="Components">{t('components')}</option>
          <option value="Clothing">{t('clothing')}</option>
          <option value="Accessories">{t('accessories')}</option>
        </select>
        
        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <button 
            onClick={resetFilters}
            className="flex items-center flex-1 sm:flex-none justify-center bg-rose-500/10 border border-rose-500/20 rounded-lg px-3 py-2 text-rose-400 hover:bg-rose-500/20 hover:text-rose-300 hover:border-rose-500/40 transition-all font-medium text-sm group"
            title="Reset filters"
          >
            <RotateCcw className="w-4 h-4 mr-1.5 group-hover:-rotate-90 transition-transform duration-300" />
            {t('clear_btn')}
          </button>
        )}
      </div>
    </div>
  );
};
export default GlobalFilters;
