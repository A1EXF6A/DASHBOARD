import React, { useState } from 'react';
import { Activity, LayoutDashboard, TrendingUp, Box, Map, Truck, Users, Menu, X, Bell, ChevronDown } from 'lucide-react';

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navItems = [
    { name: 'Overview', icon: LayoutDashboard, active: true },
    { name: 'Products & Profit', icon: TrendingUp },
    { name: 'Inventory', icon: Box },
    { name: 'Territories', icon: Map },
    { name: 'Logistics', icon: Truck },
    { name: 'Suppliers', icon: Users },
  ];

  return (
    <div className="flex h-screen bg-[#0A0A0A] text-slate-300 font-sans overflow-hidden font-inter selection:bg-cyan-500/30">
      {/* Sidebar */}
      <aside 
        className={`${sidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 ease-in-out border-r border-white/5 bg-black/40 flex flex-col backdrop-blur-xl shrink-0`}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-white/5">
          <div className="flex items-center overflow-hidden whitespace-nowrap">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shrink-0">
              <Activity className="w-5 h-5 text-white" />
            </div>
            {sidebarOpen && <h1 className="text-base font-semibold text-white ml-3">BIKES<span className="text-slate-500 font-normal ml-1">Analytics</span></h1>}
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-3 custom-scrollbar">
          <div className="mb-4">
            {sidebarOpen && <p className="text-xs font-medium text-slate-500 px-3 uppercase tracking-wider mb-2">Menu</p>}
            <ul className="space-y-1.5">
              {navItems.map((item, index) => (
                <li key={index}>
                  <a 
                    href="#" 
                    className={`flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                      item.active 
                        ? 'bg-white/10 text-white' 
                        : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                    }`}
                  >
                    <item.icon className={`w-5 h-5 shrink-0 ${item.active ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-300'}`} />
                    {sidebarOpen && <span className="font-medium ml-3 text-sm">{item.name}</span>}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>
        
        <div className="p-4 border-t border-white/5">
          <div className={`flex items-center ${sidebarOpen ? 'justify-start' : 'justify-center'} bg-white/5 rounded-xl p-2 cursor-pointer hover:bg-white/10 transition-colors border border-white/10`}>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center text-white font-semibold text-sm shrink-0">
              JS
            </div>
            {sidebarOpen && (
               <div className="ml-3 overflow-hidden">
                 <p className="text-sm font-medium text-white truncate">Admin User</p>
                 <p className="text-xs text-slate-500 truncate">admin@bikes.com</p>
               </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-900/40 via-[#0A0A0A] to-[#0A0A0A] relative">
        {/* Background glow effects */}
        <div className="absolute top-[-100px] right-[-100px] w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-[-100px] left-[-100px] w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <header className="h-16 bg-black/20 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-6 z-10 sticky top-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-semibold text-white tracking-tight">Executive Dashboard</h2>
          </div>

          <div className="flex items-center space-x-5">
             <div className="hidden md:flex items-center px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse mr-2 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
              <span className="text-xs font-medium text-emerald-400">System Live</span>
            </div>
            
            <button className="relative p-1.5 text-slate-400 hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full border border-[#0A0A0A]"></span>
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 z-10 custom-scrollbar relative">
          <div className="max-w-[1600px] mx-auto">
             {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
