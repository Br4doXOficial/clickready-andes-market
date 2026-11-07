/** Datos ficticios para el piloto de 3 tiendas. No provienen de Andes Market ni del ERP. */
export const STORES=Object.freeze([
{id:'centro',name:'Santiago Centro',address:'Local piloto ficticio 01'},
{id:'providencia',name:'Providencia',address:'Local piloto ficticio 02'},
{id:'nunoa',name:'Ñuñoa',address:'Local piloto ficticio 03'}]);
export const PRODUCTS=Object.freeze([
{id:'p01',name:'Arroz grado 1 · 1 kg',category:'Despensa',price:1690,emoji:'🍚',stock:{centro:12,providencia:9,nunoa:8}},
{id:'p02',name:'Leche entera · 1 L',category:'Lácteos',price:1390,emoji:'🥛',stock:{centro:15,providencia:7,nunoa:4}},
{id:'p03',name:'Manzanas rojas · 1 kg',category:'Frutas',price:2290,emoji:'🍎',stock:{centro:11,providencia:15,nunoa:9}},
{id:'p04',name:'Pan molde integral',category:'Panadería',price:2190,emoji:'🍞',stock:{centro:8,providencia:4,nunoa:7}},
{id:'p05',name:'Pasta espirales · 400 g',category:'Despensa',price:1090,emoji:'🍝',stock:{centro:16,providencia:14,nunoa:12}},
{id:'p06',name:'Café molido · 250 g',category:'Bebidas',price:3990,emoji:'☕',stock:{centro:7,providencia:8,nunoa:3}},
{id:'p07',name:'Yogur natural · 4 un.',category:'Lácteos',price:2490,emoji:'🥣',stock:{centro:8,providencia:6,nunoa:8}},
{id:'p08',name:'Plátano · 1 kg',category:'Frutas',price:1790,emoji:'🍌',stock:{centro:10,providencia:0,nunoa:5}},
{id:'p09',name:'Jugo naranja · 1 L',category:'Bebidas',price:1990,emoji:'🧃',stock:{centro:9,providencia:12,nunoa:12}},
{id:'p10',name:'Aceite vegetal · 900 ml',category:'Despensa',price:2690,emoji:'🫒',stock:{centro:9,providencia:5,nunoa:8}},
{id:'p11',name:'Huevos · 12 unidades',category:'Refrigerados',price:3790,emoji:'🥚',stock:{centro:10,providencia:6,nunoa:10}},
{id:'p12',name:'Detergente líquido · 1 L',category:'Limpieza',price:4890,emoji:'🧼',stock:{centro:5,providencia:8,nunoa:0}}]);
export const CATEGORIES=Object.freeze(['Todas',...new Set(PRODUCTS.map(p=>p.category))]);
export const HOURS=Object.freeze(['10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00']);