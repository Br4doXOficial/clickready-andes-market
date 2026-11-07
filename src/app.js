import {STORES,PRODUCTS,CATEGORIES,HOURS} from './data.js';
import {money,validateEmail,getStock,findProducts,setCartQuantity,limitCartToStore,cartItems,cartTotals,validateCheckout,makeDemoOrder} from './core.js';
const $=id=>document.getElementById(id);
const state={cart:{},store:'centro',query:'',category:'Todas',sort:'name',sessionEmail:''};
const KEY='clickready-academico-carrito-v1';let toastTimeout;
try{const saved=JSON.parse(localStorage.getItem(KEY)||'{}');if(saved&&typeof saved==='object'&&!Array.isArray(saved))state.cart=limitCartToStore(saved,PRODUCTS,state.store);}catch{/* No impide el uso si almacenamiento no está disponible. */}
function save(){try{localStorage.setItem(KEY,JSON.stringify(state.cart));}catch{}}
function el(tag,cls,text){const node=document.createElement(tag);if(cls)node.className=cls;if(text!==undefined)node.textContent=text;return node;}
function toast(text){const node=$('toast');node.textContent=text;node.style.display='block';clearTimeout(toastTimeout);toastTimeout=setTimeout(()=>node.style.display='none',2200);}
function renderCategories(){const box=$('categories');box.replaceChildren();for(const category of CATEGORIES){const b=el('button','category',category);b.type='button';b.setAttribute('aria-pressed',String(state.category===category));b.addEventListener('click',()=>{state.category=category;renderCategories();renderProducts();});box.append(b);}}
function renderProducts(){
 const list=findProducts(PRODUCTS,{query:state.query,category:state.category,sort:state.sort,store:state.store});
 $('results').textContent=`${list.length} producto${list.length===1?'':'s'}`;
 const box=$('products');box.replaceChildren();
 if(!list.length){box.append(el('p','placeholder','No hay productos que coincidan con tu búsqueda.'));return;}
 for(const p of list){
  const art=el('article','product');const artIcon=el('div','product-art',p.emoji);artIcon.setAttribute('aria-hidden','true');
  art.append(artIcon,el('small','',p.category),el('h3','',p.name));
  const stock=getStock(p,state.store);art.append(el('p','stock'+(stock===0?' out':''),stock>0?`Disponibles: ${stock} (demo)`:'Sin stock (demo)'));
  const foot=el('div','product-foot');foot.append(el('strong','',money(p.price)));
  const btn=el('button','primary','Agregar');btn.type='button';btn.disabled=stock===0||(state.cart[p.id]||0)>=stock;
  btn.setAttribute('aria-label',`Agregar ${p.name}`);btn.addEventListener('click',()=>updateCart(p,1));foot.append(btn);art.append(foot);box.append(art);
 }
}
function updateCart(p,delta){try{state.cart=setCartQuantity(state.cart,p,state.store,(state.cart[p.id]||0)+delta);save();renderProducts();renderCart();toast(delta>0?'Producto agregado':'Cantidad actualizada');}catch(error){toast(error.message);}}
function renderCart(){
 const list=$('cart');list.replaceChildren();const rows=cartItems(state.cart,PRODUCTS);
 if(!rows.length)list.append(el('p','placeholder','Carrito vacío. Agrega productos del catálogo.'));
 for(const p of rows){
  const item=el('div','cartitem');const label=el('div');label.append(el('strong','',p.name),el('small','',`${money(p.price)} por unidad`));
  const controls=el('div','quantity');const less=el('button','','−');less.type='button';less.setAttribute('aria-label',`Quitar unidad de ${p.name}`);less.addEventListener('click',()=>updateCart(p,-1));
  const more=el('button','','+');more.type='button';more.disabled=p.quantity>=getStock(p,state.store);more.setAttribute('aria-label',`Agregar unidad de ${p.name}`);more.addEventListener('click',()=>updateCart(p,1));
  controls.append(less,el('b','',String(p.quantity)),more);item.append(label,controls);list.append(item);
 }
 const sum=cartTotals(state.cart,PRODUCTS);
 $('total').textContent=money(sum.total);$('cartCount').textContent=`${sum.items} artículo${sum.items===1?'':'s'}`;
 $('checkoutBtn').disabled=sum.items===0;$('clearBtn').disabled=sum.items===0;
}
$('search').addEventListener('input',event=>{state.query=event.target.value;renderProducts();});
$('sort').addEventListener('change',event=>{state.sort=event.target.value;renderProducts();});
$('store').addEventListener('change',event=>{state.store=event.target.value;const old=cartTotals(state.cart,PRODUCTS).items;state.cart=limitCartToStore(state.cart,PRODUCTS,state.store);if(cartTotals(state.cart,PRODUCTS).items!==old)toast('Carrito ajustado al stock ficticio de la tienda');save();renderProducts();renderCart();});
$('clearBtn').addEventListener('click',()=>{state.cart={};save();renderProducts();renderCart();toast('Carrito vaciado');});
for(const btn of document.querySelectorAll('[data-close]'))btn.addEventListener('click',()=>$(btn.dataset.close).close());
$('loginToggle').addEventListener('click',()=>$('loginDialog').showModal());
$('loginForm').addEventListener('submit',event=>{event.preventDefault();const email=$('demoEmail').value.trim();if(!validateEmail(email)){$('loginError').textContent='Escribe un correo válido.';return;}$('loginError').textContent='';state.sessionEmail=email;$('loginToggle').textContent='Sesión demo: '+email;$('checkoutEmail').value=email;$('loginDialog').close();toast('Sesión visual activada. No hay autenticación real.');});
$('checkoutBtn').addEventListener('click',()=>{
 if(!cartTotals(state.cart,PRODUCTS).items)return;
 const tomorrow=new Date();tomorrow.setDate(tomorrow.getDate()+1);
 const futureDate=[tomorrow.getFullYear(),String(tomorrow.getMonth()+1).padStart(2,'0'),String(tomorrow.getDate()).padStart(2,'0')].join('-');
 const now=new Date();$('date').min=[now.getFullYear(),String(now.getMonth()+1).padStart(2,'0'),String(now.getDate()).padStart(2,'0')].join('-');
 $('date').value=futureDate;
 $('hour').replaceChildren(...HOURS.map(h=>{const o=document.createElement('option');o.value=h;o.textContent=`${h} a ${Number(h.slice(0,2))+1}:00`;return o;}));
 $('checkSummary').textContent=`Tienda: ${STORES.find(s=>s.id===state.store).name} · ${cartTotals(state.cart,PRODUCTS).items} artículos · ${money(cartTotals(state.cart,PRODUCTS).total)}.`;
 $('checkoutError').textContent='';$('demoConsent').checked=false;$('checkoutDialog').showModal();
});
$('checkoutForm').addEventListener('submit',event=>{
 event.preventDefault();
 const model={cart:state.cart,products:PRODUCTS,store:state.store,storeIds:STORES.map(s=>s.id),mode:$('mode').value,date:$('date').value,hour:$('hour').value,hours:HOURS,email:$('checkoutEmail').value};
 const errors=validateCheckout(model);if(!$('demoConsent').checked)errors.push('Debes reconocer que es una simulación.');
 if(errors.length){$('checkoutError').textContent=errors.join(' ');return;}
 const id='CR-DEMO-'+String(Date.now()).slice(-8);const order=makeDemoOrder({...model,id});
 const receipt=$('receipt');receipt.replaceChildren();const outer=el('div','receiptbox');
 outer.append(el('p','receipt-label','PEDIDO FICTICIO · NO VÁLIDO PARA RETIRO'),el('p','',`Folio: ${order.id}`),el('p','',`Tienda: ${STORES.find(s=>s.id===order.store).name}`),el('p','',`Modalidad: ${order.mode==='retiro'?'Retiro':'Entrega de ejemplo'}`),el('p','',`Fecha y hora: ${order.date}, ${order.hour}`),el('p','',`Correo mostrado: ${order.email}`));
 const ul=el('ul');for(const p of order.items)ul.append(el('li','',`${p.quantity} × ${p.name}: ${money(p.subtotal)}`));
 outer.append(ul,el('p','receipt-label',`Total ilustrativo: ${money(order.total)}`),el('p','','Transacción simulada: '+order.token),el('p','','Ningún dato fue enviado a servicios externos. No hubo cargo ni correo enviado.'));
 receipt.append(outer);state.cart={};save();renderProducts();renderCart();$('checkoutDialog').close();$('receiptDialog').showModal();
});
$('printReceipt').addEventListener('click',()=>window.print());
renderCategories();renderProducts();renderCart();