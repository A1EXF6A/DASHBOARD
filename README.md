# BIKES Analytics Dashboard

Este proyecto es un panel ejecutivo interactivo diseñado para potenciar la toma de decisiones basada en datos. Está segmentado en categorías lógicas que responden de manera precisa a preguntas clave de negocio, utilizando datos provenientes de distintas áreas de la empresa (Ventas, Inventario, Logística, Proveedores, etc.).

El dashboard incorpora filtros dinámicos y globales (Año, Mes, Región, Categoría, Canal) que impactan tanto a los KPIs superiores como a cada uno de los gráficos renderizados.

A continuación, se detalla **cada gráfico disponible en el panel**, qué valores calcula, y para qué análisis estratégico está diseñado.

---

## 1. Productos y Margen (Products & Profit)

### Rentabilidad de Productos (ProfitabilityChart)
- **¿Qué calcula?** Sumariza el Ingreso Total y el Margen Neto agrupando la base de datos por `Producto`. Se ordena descendentemente para mostrar el "Top 100" de los productos más rentables.
- **Valores en uso:** Eje X = Margen Neto (ordenado), Eje Y = Nombre del Producto, Burbuja/Tooltip = Volumen de Ventas.
- **Análisis posible:** Identificar cuáles son los productos estrella de la empresa y cuáles, a pesar de tener un alto volumen de ventas, tienen márgenes bajos (o incluso negativos) debido a sobrecostos. 

### Combinación de Productos / Combos (ComboAnalysisChart)
- **¿Qué calcula?** Analiza la tabla de hechos `FactVentasCombo`, descubriendo qué par de productos generan mayor utilidad cuando se venden juntos en la misma transacción.
- **Valores en uso:** Se presenta a modo de *Gráfico de Burbujas*. Eje X = Ingreso Total, Eje Y = Margen Neto, Tamaño de Burbuja = Unidades Vendidas del combo. Se mapean los nombres cruzados (Ej. "Helmet + Bike").
- **Análisis posible:** Ideal para optimizar estrategias de *Cross-Selling* (ventas cruzadas) y diseñar promociones o paquetes. Aquellas mezclas en la parte superior derecha indican un excelente motor de ingresos y margen.

### Anatomía Financiera por Categoría (ProfitStructureChart)
- **¿Qué calcula?** Toma todos los componentes que construyen el precio de venta (Costo de Producción, Costo Logístico, Margen, y Descuentos aplicados) para desglosar financieramente cada "Categoría" de producto.
- **Valores en uso:** Gráfico de Barras Apiladas (*Stacked Bar*). Eje X = Categoría (Bikes, Components, etc.), Eje Y = Sumatoria apilada monetaria.
- **Análisis posible:** Permite a los analistas financieros observar cuánto del ingreso bruto se ve reducido por descuentos y costos ocultos (de transporte). Si la barra de "logística" es muy ancha comparada con el margen, es señal para negociar nuevas tarifas de envío.

---

## 2. Inventario y Demanda (Inventory)

### Inventario vs Demanda - Top Desalineación (InventoryDemandChart)
- **¿Qué calcula?** Cruza la tabla `FactInventario` con `FactVentas`, comparando el `Stock Promedio` disponible vs las `Ventas Totales` (demanda real) para un mismo producto y/o sucursal. El backend calcula un "Ratio de Desalineación" (Stock / Demanda).
- **Valores en uso:** Gráfico Combinado. Barras difuminadas = Stock promedio, Área = Demanda Histórica.
- **Análisis posible:** Encontrar productos que acumulan un exceso de stock excesivo respecto a su salida mensual, o viceversa (productos con demanda altísima pero sin stock, provocando quiebres frecuentes).

### Matriz de Desalineación de Inventario (StockVsSalesScatterChart)
- **¿Qué calcula?** Ubica a cada producto en un plano cartesiano (Dispersión) en base a su nivel de almacenamiento generalizado versus su volumen de salida (ventas).
- **Valores en uso:** Eje X = Stock Promedio, Eje Y = Ventas Totales. Cada punto simboliza un Producto.
- **Análisis posible:** Es una herramienta rápida para auditorías visuales: el cuadrante "inferior derecho" representará capital ocioso (mucho stock, casi cero ventas), obligando posibles remates o liquidaciones.

### Tendencia Histórica - Stock vs Demanda (StockVsSalesTrendChart)
- **¿Qué calcula?** A diferencia de los otros gráficos estáticos por producto, este agrupa ambas métricas (Inventario vs Ventas) según la línea del tiempo (`Año` y `Mes`).
- **Valores en uso:** Eje X = Período (Ej. 2013-05), Eje Y Izquierdo (Barras) = Stock Promedio de toda la empresa, Eje Y Derecho (Línea) = Demanda total de la empresa.
- **Análisis posible:** Identifica ciclos y estocasticidad (estacionalidades). Permite validar si las compras o la fabricación corporativa está reaccionando a tiempo antes de los picos de demanda anual (ej. festividades).

---

## 3. Territorios y Canales (Territories)

### Crecimiento Sectorial Histórico (TerritoryGrowthChart)
- **¿Qué calcula?** Agrupa los ingresos de venta secuencialmente por el `Tiempo` (Año/Mes), segmentado además por las condiciones globales del Dashboard. 
- **Valores en uso:** Gráfico de Área Múltiple (Línea de tiempo). Apila o muestra las tendencias a lo largo de los años.
- **Análisis posible:** Validar si una región o territorio de facto presenta un alto o bajo crecimiento sostenido con el pasar del tiempo.

### Matriz de Crecimiento por Canal (TerritoryMatrixChart)
- **¿Qué calcula?** Por cada `Canal de Venta` (Online, Tienda Física, etc.), evalúa el porcentaje de *Participación* total que ese canal representa en la empresa frente al porcentaje de *Crecimiento Anual*.
- **Valores en uso:** Gráfico de Dispersión. Eje X = Participación en % (ingresos del canal vs ingresos totales del año actual), Eje Y = Crecimiento en % (ingresos recientes vs ingresos año previo), Burbuja = Número de Clientes Únicos conseguidos.
- **Análisis posible:** Estrategia pura: ¿Estamos creciendo velozmente en el canal Online pero este canal aún representa apenas el 2% de nuestros ingresos? Eso dictará prioridades presupuestarias y foco de inversión (matriz BCG-style).

---

## 4. Costos Logísticos (Logistics)

### Eficiencia de Costos Logísticos (LogisticsCostChart)
- **¿Qué calcula?** Para cada método de envío preestablecido (Freight, Air, Sea, Truck), suma el total del costo logístico y calcula su proporción porcentual frente a los ingresos generados por los productos despachados usando ese método.
- **Valores en uso:** Gráfico combinado. Ejes secundarios. Línea indicando la ratio Costo/Ingreso y Barras indicando Costo Total Monetario.
- **Análisis posible:** Esencial para detectar sobrecostos insostenibles (ej: El flete aéreo representa un 40% del costo del producto al usarlo en zonas remotas de Europa). Dispara renegociaciones con transportistas.

### Eficiencia de Transportistas por Línea (LogisticsCategoryChart)
- **¿Qué calcula?** Similar al anterior, pero desglosa el "Ratio" dentro de cada forma de envío dividiéndolo ahora por las Categorías de Producto vendidas.
- **Valores en uso:** Barras Radiales o Múltiples de porcentaje por categoría.
- **Análisis posible:** ¿Cuesta lo mismo enviar una Bicicleta online que enviar Accesorios por avión frente a su precio neto? Respuestas inmediatas ante fugas logísticas en productos de margen ajustado.

---

## 5. Proveedores (Suppliers)

### Rendimiento de Proveedores (SupplierLeadTimeChart)
- **¿Qué calcula?** Agrupa las compras de abastecimiento, sumando su presupuesto pero calculando de promedio vital: `Tiempo de Entrega` (Lead time) en días por cada Proveedor particular. 
- **Valores en uso:** Gráfico de Eje dual. Eje X = Proveedor, Eje Y (barras) = Dinero gastado o comprometido, Eje Y derecho (Línea) = Tiempo en días históricos antes de recepción.
- **Análisis posible:** Evidencia del riesgo logístico externo. A quienes la empresa compra más volúmenes (barras altas) DEBERÍAN tener los tiempos de respuesta o entrega más bajos y certeros. Picos en la línea señalan proveedores tardíos.

### Matriz de Riesgo vs Costo del Proveedor (SupplierCostScatterChart)
- **¿Qué calcula?** Combina las 3 variables duras de los proveedores en un plano cartesiano limitando su complejidad a los de mayor impacto (burbujas grandes = alto volumen).
- **Valores en uso:** Dispersión / Eje X = Costo Unitario Promedio, Eje Y = Lead time (Tiempo de Entrega), Tamaño = Volumen de Ítems.
- **Análisis posible:** ¿Estoy pagando primas (ejes X altos) por proveedores en los que asumo riesgos temporales enormes (eje Y alto)? Los proveedores "VIP" deberían agruparse cerca del punto (0,0) (Bajo costo, Bajísimo retraso de entrega).

---

### Distribución de Componentes y Fabricación (ComponentUsageChart)
- **¿Qué calcula?** Evalúa las órdenes de planta y fabricación (`FactFabricacion`), contando los sub-componentes obligatorios para fabricar unidades empujadas por inventario general.
- **Valores en uso:** Gráfico circular radial (Pie/RadialBar) segmentando las familias de producción. Mapea la complejidad técnica midiendo componentes vs unidades sacadas de línea ensamblaje.
- **Análisis posible:** Identifica el consumo intensivo de insumos por categoría. Si la venta de bicicletas requiere un despilfarro abismal de componentes que provienen de un "mal proveedor logístico", la resiliencia del negocio está en peligro y debe encadenarse inteligentemente.
