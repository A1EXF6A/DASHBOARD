const translations = {
  en: {
    // Menu
    menu_title: 'Menu',
    nav_overview: 'Overview',
    nav_products_profit: 'Products & Profit',
    nav_inventory: 'Inventory',
    nav_territories: 'Territories',
    nav_logistics: 'Logistics',
    nav_suppliers: 'Suppliers',
    
    // Header
    admin_user: 'Admin User',
    system_live: 'System Live',
    executive_dashboard: 'Dashboard',

    // Filters
    search_placeholder: 'Search metric or dimension...',
    filters_title: 'Filters',
    all_time: 'All Time',
    all_regions: 'All Regions',
    all_categories: 'All Categories',
    all_months: 'All Months',
    all_channels: 'All Channels',
    online: 'Online',
    retail: 'Retail',
    wholesale: 'Wholesale',
    north_america: 'North America',
    europe: 'Europe',
    pacific: 'Pacific',
    bikes: 'Bikes',
    components: 'Components',
    clothing: 'Clothing',
    accessories: 'Accessories',
    clear_btn: 'Clear',

    // KPIs
    kpi_revenue: 'Total Revenue',
    kpi_profit_margin: 'Avg Profit Margin',
    kpi_inventory_turnover: 'Inventory Turnover',
    kpi_sales_growth: 'Sales Growth',
    vs_last_month: 'vs last month',
    vs_last_year: 'vs last year',

    // Profitability Chart
    prof_title: 'Top Products Profitability',
    prof_subtitle: 'Net Margin ranked by product',
    prof_margin: 'Net Margin',
    prof_revenue: 'Total Revenue',
    btn_report: 'View Report',

    // Inventory Chart
    inv_title: 'Inventory vs Demand',
    inv_subtitle: 'Stock levels across facilities vs Total Demand',
    inv_stock: 'Avg Stock',
    inv_demand: 'Total Demand',
    btn_stock: 'Manage Stock',
    units: 'units',

    // Combo Chart
    combo_title: 'Top Product Bundles',
    combo_subtitle: 'Margin vs Revenue (Bubble size: Volume)',
    combo_key: 'Combo Key',
    combo_revenue: 'Total Revenue',
    combo_margin: 'Net Margin',
    combo_units: 'Units Sold',

    // Logistics Chart
    log_title: 'Logistics Cost Efficiency',
    log_subtitle: 'Cost vs Revenue Ratio by Shipping Method',
    log_cost: 'Total Logistic Cost',
    log_revenue: 'Total Revenue',
    log_ratio: 'Cost/Revenue Ratio',

    // Supplier Chart
    sup_title: 'Supplier Performance',
    sup_subtitle: 'Lead Time vs Total Spend',
    sup_spend: 'Total Spend',
    sup_lead: 'Lead Time Avg',
    days: 'days',

    // Territory Chart
    terr_title: 'Channel & Territory Growth',
    terr_subtitle: 'Revenue trend over time',
    terr_revenue: 'Total Revenue',
    terr_clients: 'Unique Clients',

    // Territory Matrix Chart (New)
    terr_matrix_title: 'Channel Matrix',
    terr_matrix_subtitle: 'Participation vs Growth (Bubble: Clients)',
    terr_part: 'Participation',
    terr_growth: 'Growth Rate',

    // Component Chart
    comp_title: 'Component Distribution',
    comp_subtitle: 'Usage per Category',
    comp_total: 'Total Components',
    comp_units: 'Units Mfc',

    // Profit Structure Chart (New)
    profit_st_title: 'Financial Anatomy by Category',
    profit_st_subtitle: 'Revenue Breakdown (Cost + Logstc + Margin + Dscnt)',
    profit_st_production: 'Production Cost',
    profit_st_logistic: 'Logistic Cost',
    profit_st_discount: 'Applied Discount',

    // Logistics Category Chart (New)
    log_cat_title: 'Carrier Efficiency Across Lines',
    log_cat_subtitle: 'Logistic Cost / Revenue Ratio (%)',
    
    // Supplier Scatter Chart (New)
    sup_scat_title: 'Supplier Risk vs Profitability Matrix',
    sup_scat_subtitle: 'Lead Time vs Base Cost (Bubble: Order Volume)',
    sup_scat_cost: 'Unit Cost',
    sup_scat_vol: 'Purchase Volume',
    
    // Inventory Additional Charts
    inv_trend_title: 'Stock vs Demand Trend',
    inv_trend_subtitle: 'Time evolution of average stock vs sales',
    inv_trend_period: 'Period',
    inv_scat_title: 'Inventory Misalignment Matrix',
    inv_scat_subtitle: 'Cross-reference of Stock Levels vs Sales Volume',
    
    // Globals
    loading: 'Loading metrics...'
  },
  es: {
    // Menú
    menu_title: 'Menú principal',
    nav_overview: 'Resumen Global',
    nav_products_profit: 'Productos y Margen',
    nav_inventory: 'Inventario y Demanda',
    nav_territories: 'Territorios y Canales',
    nav_logistics: 'Costos Logísticos',
    nav_suppliers: 'Proveedores',
    
    // Encabezado
    admin_user: 'Usuario Admin',
    system_live: 'Sistema Activo',
    executive_dashboard: 'Panel',

    // Filtros
    search_placeholder: 'Buscar métrica o dimensión...',
    filters_title: 'Filtros',
    all_time: 'Todo el tiempo',
    all_regions: 'Todas las regiones',
    all_categories: 'Todas las categorías',
    all_months: 'Todos los Meses',
    all_channels: 'Todos los Canales',
    online: 'Online',
    retail: 'Tienda',
    wholesale: 'Distribuidor',
    north_america: 'Norteamérica',
    europe: 'Europa',
    pacific: 'Pacífico',
    bikes: 'Bicicletas',
    components: 'Componentes',
    clothing: 'Indumentaria',
    accessories: 'Accesorios',
    clear_btn: 'Limpiar',

    // KPIs
    kpi_revenue: 'Ingreso Total',
    kpi_profit_margin: 'Margen Promedio',
    kpi_inventory_turnover: 'Rotación Inventario',
    kpi_sales_growth: 'Crecimiento de Ventas',
    vs_last_month: 'vs mes anterior',
    vs_last_year: 'vs año anterior',

    // Gráfico de Rentabilidad
    prof_title: 'Rentabilidad de Productos',
    prof_subtitle: 'Margen neto clasificado por producto de mayor a menor',
    prof_margin: 'Margen Neto',
    prof_revenue: 'Ingreso Total',
    btn_report: 'Ver Reporte',

    // Gráfico de Inventario
    inv_title: 'Inventario vs Demanda',
    inv_subtitle: 'Niveles de stock promedio cruzados contra ventas',
    inv_stock: 'Stock Promedio',
    inv_demand: 'Demanda Total',
    btn_stock: 'Gestionar Stock',
    units: 'unidades',

    // Gráfico de Combos
    combo_title: 'Combinación de Productos (Combos)',
    combo_subtitle: 'Margen vs Ingreso (Tamaño = Volumen)',
    combo_key: 'ID de Combo',
    combo_revenue: 'Ingreso Total',
    combo_margin: 'Margen Neto',
    combo_units: 'Unidades Vendidas',

    // Gráfico de Logística
    log_title: 'Eficiencia de Costos Logísticos',
    log_subtitle: 'Ratio de Costo Logístico vs Ingreso por Método de Envío',
    log_cost: 'Costo Logístico Total',
    log_revenue: 'Ingreso Total',
    log_ratio: 'Ratio (Costo/Ingreso)',

    // Gráfico de Proveedores
    sup_title: 'Rendimiento de Proveedores',
    sup_subtitle: 'Tiempo Promedio de Entrega vs Gasto Total',
    sup_spend: 'Gasto Total',
    sup_lead: 'Tiempo de Entrega',
    days: 'días',

    // Gráfico de Territorios
    terr_title: 'Crecimiento Sectorial',
    terr_subtitle: 'Evolución de ingresos a lo largo del tiempo',
    terr_revenue: 'Ingreso Total',
    terr_clients: 'Clientes Únicos',

    // Territory Matrix Chart (New)
    terr_matrix_title: 'Matriz de Crecimiento por Canal',
    terr_matrix_subtitle: 'Participación vs Crecimiento (Burbuja: Clientes)',
    terr_part: 'Participación',
    terr_growth: 'Tasa de Crecimiento',

    // Gráfico de Componentes
    comp_title: 'Distribución de Componentes',
    comp_subtitle: 'Uso por categoría de producto',
    comp_total: 'Componentes Totales',
    comp_units: 'Unidades Fabricadas',

    // Profit Structure Chart (New)
    profit_st_title: 'Anatomía Financiera por Categoría',
    profit_st_subtitle: 'Desglose de Ingresos (Costo + Logística + Margen + Descuentos)',
    profit_st_production: 'Costo Producción',
    profit_st_logistic: 'Costo Logístico',
    profit_st_discount: 'Descuento Aplicado',

    // Logistics Category Chart (New)
    log_cat_title: 'Eficiencia de Transportistas por Línea',
    log_cat_subtitle: 'Ratio de Costo Logístico / Ingreso (%)',
    
    // Supplier Scatter Chart (New)
    sup_scat_title: 'Matriz de Riesgo vs Costo del Proveedor',
    sup_scat_subtitle: 'Tiempo de Entrega vs Costo Base (Burbuja: Volumen de Compras)',
    sup_scat_cost: 'Costo Unitario',
    sup_scat_vol: 'Volumen Compras',

    // Inventory Additional Charts
    inv_trend_title: 'Tendencia Histórica: Stock vs Demanda',
    inv_trend_subtitle: 'Evolución por meses del stock promedio frente a las ventas',
    inv_trend_period: 'Período',
    inv_scat_title: 'Matriz de Desalineación de Inventario',
    inv_scat_subtitle: 'Niveles de stock promedio cruzados contra volumen de ventas',
    
    // Globales
    loading: 'Cargando métricas...'
  }
};

export default translations;
