/** Lógica de negocio verificable con Node sin dependencias externas. */
export const money=(amount)=>new Intl.NumberFormat('es-CL',{style:'currency',currency:'CLP',maximumFractionDigits:0}).format(amount);
export function normalizeText(value=''){return String(value).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();}
export function validateEmail(email){return typeof email==='string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) && email.trim().length<=254;}
export function getStock(product,store){return Math.max(0,Number(product?.stock?.[store]??0));}
export function findProducts(products,{query='',category='Todas',sort='name',store='centro'}={}){
 const term=normalizeText(query);
 return products.filter(p=>(category==='Todas'||p.category===category) && normalizeText(p.name+' '+p.category).includes(term)).sort((a,b)=>{
  if(sort==='asc')return a.price-b.price;if(sort==='desc')return b.price-a.price;if(sort==='stock')return getStock(b,store)-getStock(a,store);return a.name.localeCompare(b.name,'es');
 });
}
export function setCartQuantity(cart,product,store,quantity){
 if(!product)throw new Error('Producto inexistente');
 const requested=Number(quantity);
 if(!Number.isInteger(requested)||requested<0)throw new Error('Cantidad inválida');
 if(requested>getStock(product,store))throw new Error('La cantidad supera el stock de ejemplo');
 const next={...cart};if(requested===0)delete next[product.id];else next[product.id]=requested;return next;
}
export function limitCartToStore(cart,products,store){
 const result={};for(const p of products){const qty=Math.min(getStock(p,store),Math.max(0,Number(cart[p.id])||0));if(qty>0)result[p.id]=qty;}return result;
}
export function cartItems(cart,products){return products.filter(p=>Number(cart[p.id])>0).map(p=>({...p,quantity:Number(cart[p.id]),subtotal:p.price*Number(cart[p.id])}));}
export function cartTotals(cart,products){const items=cartItems(cart,products);return {items:items.reduce((sum,p)=>sum+p.quantity,0),total:items.reduce((sum,p)=>sum+p.subtotal,0)};}
export function validateCheckout({cart,products,store,storeIds,mode,date,hour,email,hours}){
 const errors=[];
 if(!storeIds.includes(store))errors.push('Selecciona una tienda piloto.');
 if(cartTotals(cart,products).items===0)errors.push('Agrega al menos un producto.');
 for(const p of products){if((Number(cart[p.id])||0)>getStock(p,store))errors.push(`Stock insuficiente para ${p.name}.`);}
 if(!['retiro','entrega'].includes(mode))errors.push('Selecciona retiro o entrega.');
 if(!/^\d{4}-\d{2}-\d{2}$/.test(date??''))errors.push('Selecciona una fecha válida.');
 else{const dateObj=new Date(date+'T12:00:00');if(Number.isNaN(dateObj.getTime())||dateObj.toISOString().slice(0,10)!==date)errors.push('Fecha inexistente.');const now=new Date();now.setHours(0,0,0,0);if(dateObj<now)errors.push('La fecha no puede estar en el pasado.');}
 if(!Array.isArray(hours)||!hours.includes(hour))errors.push('Selecciona una franja disponible.');
 if(!validateEmail(email))errors.push('Ingresa un correo válido para la simulación.');
 return errors;
}
export function makeDemoOrder({cart,products,store,mode,date,hour,email,id}){
 const values=cartTotals(cart,products);if(!values.items)throw new Error('No se puede confirmar un carrito vacío');
 return {id,store,mode,date,hour,email:email.trim(),items:cartItems(cart,products).map(p=>({name:p.name,quantity:p.quantity,price:p.price,subtotal:p.subtotal})),total:values.total,status:'SIMULADO · SIN COBRO NI ENVÍO DE CORREO',token:`DEMO-${id}`};
}