import React from 'react';
import DashboardLayout from './components/Layout/DashboardLayout';
import KPICards from './components/Dashboard/KPICards';
import GlobalFilters from './components/Filters/GlobalFilters';
import ProfitabilityChart from './components/Charts/ProfitabilityChart';
import InventoryDemandChart from './components/Charts/InventoryDemandChart';
import ComboAnalysisChart from './components/Charts/ComboAnalysisChart';
import LogisticsCostChart from './components/Charts/LogisticsCostChart';
import SupplierLeadTimeChart from './components/Charts/SupplierLeadTimeChart';
import TerritoryGrowthChart from './components/Charts/TerritoryGrowthChart';
import ComponentUsageChart from './components/Charts/ComponentUsageChart';

function App() {
  return (
    <DashboardLayout>
      <GlobalFilters />
      <KPICards />
      
      {/* Primary Financial & Operational Row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        <ProfitabilityChart />
        <InventoryDemandChart />
      </div>

      {/* Secondary Metrics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
         <div className="lg:col-span-1">
            <ComboAnalysisChart />
         </div>
         <div className="lg:col-span-1">
            <LogisticsCostChart />
         </div>
         <div className="lg:col-span-1">
            <SupplierLeadTimeChart />
         </div>
      </div>

      {/* Tertiary Metrics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
         <div className="lg:col-span-2">
            <TerritoryGrowthChart />
         </div>
         <div className="lg:col-span-1">
            <ComponentUsageChart />
         </div>
      </div>
    </DashboardLayout>
  );
}

export default App;
