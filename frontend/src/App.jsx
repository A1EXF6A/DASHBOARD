import React, { useState } from 'react';
import DashboardLayout from './components/Layout/DashboardLayout';
import KPICards from './components/Dashboard/KPICards';
import GlobalFilters from './components/Filters/GlobalFilters';
import ProfitabilityChart from './components/Charts/ProfitabilityChart';
import InventoryDemandChart from './components/Charts/InventoryDemandChart';
import ComboAnalysisChart from './components/Charts/ComboAnalysisChart';
import LogisticsCostChart from './components/Charts/LogisticsCostChart';
import SupplierLeadTimeChart from './components/Charts/SupplierLeadTimeChart';
import TerritoryGrowthChart from './components/Charts/TerritoryGrowthChart';
import TerritoryMatrixChart from './components/Charts/TerritoryMatrixChart';
import ComponentUsageChart from './components/Charts/ComponentUsageChart';
import ProfitStructureChart from './components/Charts/ProfitStructureChart';
import LogisticsCategoryChart from './components/Charts/LogisticsCategoryChart';
import SupplierCostScatterChart from './components/Charts/SupplierCostScatterChart';
import { FilterProvider } from './context/FilterContext';
import { LanguageProvider } from './context/LanguageContext';

function App() {
  const [activeTab, setActiveTab] = useState('Overview');

  const renderView = () => {
    switch(activeTab) {
      case 'Products & Profit':
        return (
          <>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
              <ProfitabilityChart />
              <ComboAnalysisChart />
            </div>
            <div className="grid grid-cols-1 gap-6 mb-6">
              <ProfitStructureChart />
            </div>
          </>
        );
      case 'Inventory':
        return (
          <div className="grid grid-cols-1 gap-6 mb-6">
            <InventoryDemandChart />
          </div>
        );
      case 'Territories':
        return (
          <>
             <div className="grid grid-cols-1 gap-6 mb-6">
                <TerritoryGrowthChart />
             </div>
             <div className="grid grid-cols-1 gap-6 mb-6">
                <TerritoryMatrixChart />
             </div>
          </>
        );
      case 'Logistics':
         return (
          <>
            <div className="grid grid-cols-1 gap-6 mb-6">
              <LogisticsCostChart />
            </div>
            <div className="grid grid-cols-1 gap-6 mb-6">
              <LogisticsCategoryChart />
            </div>
          </>
        );
      case 'Suppliers':
        return (
          <>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
               <SupplierLeadTimeChart />
               <ComponentUsageChart />
            </div>
            <div className="grid grid-cols-1 gap-6 mb-6">
               <SupplierCostScatterChart />
            </div>
          </>
        );
      default: // 'Overview'
        return (
           <>
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
                    <TerritoryMatrixChart />
                 </div>
              </div>
           </>
        );
    }
  };

  return (
    <LanguageProvider>
      <FilterProvider>
        <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab}>
          <GlobalFilters />
        
        {/* Render KPICards only in Overview, or we can choose to leave them globally */}
        {activeTab === 'Overview' && <KPICards />}
        
        {/* Render Dynamic Views based on active Sidebar Item */}
        <div className="transition-all duration-300">
           {renderView()}
          </div>
        </DashboardLayout>
      </FilterProvider>
    </LanguageProvider>
  );
}

export default App;
