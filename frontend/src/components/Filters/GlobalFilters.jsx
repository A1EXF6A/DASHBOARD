import React from 'react';
import { Calendar, SlidersHorizontal, MapPin, Tag, Search } from 'lucide-react';

const GlobalFilters = () => {
  return (
    <div className="bg-[#111111] border border-white/10 rounded-2xl p-4 mb-8 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <div className="relative w-full lg:w-auto">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search metric or dimension..." 
            className="bg-[#0A0A0A] border border-white/10 text-white text-sm rounded-lg pl-9 pr-4 py-2 w-full lg:w-80 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all placeholder:text-slate-600"
          />
        </div>
      </div>
      
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center text-slate-400 font-medium text-sm mr-2 hidden xl:flex">
          <SlidersHorizontal className="w-3.5 h-3.5 mr-2" />
          Filters
        </div>
        
        <button className="flex items-center flex-1 sm:flex-none justify-center bg-[#0A0A0A] border border-white/10 rounded-lg px-3.5 py-2 hover:border-white/30 hover:bg-white/5 transition-all group">
          <Calendar className="w-4 h-4 mr-2 text-slate-400 group-hover:text-white transition-colors" />
          <span className="text-sm font-medium text-slate-300">Last 30 Days</span>
        </button>

        <button className="flex items-center flex-1 sm:flex-none justify-center bg-[#0A0A0A] border border-white/10 rounded-lg px-3.5 py-2 hover:border-white/30 hover:bg-white/5 transition-all group">
          <MapPin className="w-4 h-4 mr-2 text-slate-400 group-hover:text-white transition-colors" />
          <span className="text-sm font-medium text-slate-300">All Regions</span>
        </button>

        <button className="flex items-center flex-1 sm:flex-none justify-center bg-[#0A0A0A] border border-white/10 rounded-lg px-3.5 py-2 hover:border-white/30 hover:bg-white/5 transition-all group">
          <Tag className="w-4 h-4 mr-2 text-slate-400 group-hover:text-white transition-colors" />
          <span className="text-sm font-medium text-slate-300">All Categories</span>
        </button>
      </div>
    </div>
  );
};
export default GlobalFilters;
