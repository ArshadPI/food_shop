// Menu data: edit names, prices and emoji here to change the shop.
var MENU=[
 {id:1,cat:"Meals",e:"🍛",n:"Veg meals box",d:"Rice, sambar, two curries, pickle and papad.",p:140,t:"Bestseller"},
 {id:2,cat:"Meals",e:"🍗",n:"Chicken curry meal",d:"Home-style chicken curry with rice and salad.",p:190},
 {id:3,cat:"Meals",e:"🐟",n:"Fish fry thali",d:"Fried fish, rice, moru curry and thoran.",p:220},
 {id:4,cat:"Meals",e:"🥘",n:"Egg roast with parotta",d:"Two parottas and a spicy onion egg roast.",p:130},
 {id:5,cat:"Snacks",e:"🥟",n:"Vegetable samosa (4)",d:"Crisp pastry with spiced potato and peas.",p:60},
 {id:6,cat:"Snacks",e:"🍌",n:"Banana fritters (6)",d:"Ripe banana in a light batter, fried to order.",p:70,t:"Fresh at 4 pm"},
 {id:7,cat:"Snacks",e:"🥔",n:"Masala vada (5)",d:"Chana dal fritters with onion and curry leaf.",p:55},
 {id:8,cat:"Drinks",e:"🍵",n:"Masala chai",d:"Ginger and cardamom tea, served hot.",p:20},
 {id:9,cat:"Drinks",e:"🥛",n:"Sweet lassi",d:"Thick, chilled yoghurt drink.",p:50},
 {id:10,cat:"Drinks",e:"🍋",n:"Fresh lime soda",d:"Sweet, salted or mixed.",p:40},
 {id:11,cat:"Sweets",e:"🍮",n:"Payasam cup",d:"Milk and vermicelli pudding with cashews.",p:60,t:"Bestseller"},
 {id:12,cat:"Sweets",e:"🍩",n:"Gulab jamun (3)",d:"Soft milk dumplings in warm syrup.",p:75}
];
var CATS=["All","Meals","Snacks","Drinks","Sweets"], FREE_AT=400, FEE=40;
var cat="All", cart={}, view="cart", lastOrder=null;

// Cart persistence: wrapped in try/catch because storage can be unavailable.
try{var s=JSON.parse(localStorage.getItem("tl-cart")||"{}"); if(s&&typeof s==="object")cart=s;}catch(e){}
function save(){try{localStorage.setItem("tl-cart",JSON.stringify(cart))}catch(e){}}

var $=function(i){return document.getElementById(i)};
var money=function(n){return "₹"+n};
function find(id){return MENU.find(function(m){return m.id==id})}
function items(){return Object.keys(cart).filter(function(k){return cart[k]>0&&find(k)}).map(function(k){return {m:find(k),q:cart[k]}})}
function sub(){return items().reduce(function(a,x){return a+x.m.p*x.q},0)}
function count(){return items().reduce(function(a,x){return a+x.q},0)}
function esc(t){var d=document.createElement("div");d.textContent=t;return d.innerHTML}

function renderChips(){
  $("chips").innerHTML=CATS.map(function(c){return '<button class="chip" aria-pressed="'+(c===cat)+'" data-c="'+c+'">'+c+'</button>'}).join("");
}
function renderMenu(){
  $("grid").innerHTML=MENU.filter(function(m){return cat==="All"||m.cat===cat}).map(function(m){
    var q=cart[m.id]||0;
    var ctl=q?'<div class="qty"><button data-dec="'+m.id+'" aria-label="Remove one '+esc(m.n)+'">−</button><b>'+q+'</b><button data-inc="'+m.id+'" aria-label="Add one '+esc(m.n)+'">+</button></div>'
             :'<button class="add" data-inc="'+m.id+'">Add</button>';
    return '<article class="card"><div class="pic" aria-hidden="true">'+m.e+'</div>'+(m.t?'<span class="tag">'+m.t+'</span>':'')+'<h3>'+m.n+'</h3><p>'+m.d+'</p><div class="row"><span class="price">'+money(m.p)+'</span>'+ctl+'</div></article>';
  }).join("");
}
function totals(mode){var s=sub(),f=(mode==="pickup"||s>=FREE_AT||s===0)?0:FEE;return {s:s,f:f,t:s+f}}

function renderDrawer(){
  var b=$("body"),f=$("foot"),list=items();
  if(view==="done"){
    $("title").textContent="Order placed";
    b.innerHTML='<div class="done"><div class="big">✅</div><h3>Thank you, '+esc(lastOrder.name)+'.</h3><p>Order <b>'+lastOrder.no+'</b> will be ready for '+(lastOrder.mode==="pickup"?"pickup":"delivery")+' in about '+(lastOrder.mode==="pickup"?"25":"45")+' minutes.</p><p style="color:var(--muted)">Total to pay on '+(lastOrder.mode==="pickup"?"pickup":"delivery")+': <b>'+money(lastOrder.total)+'</b></p><p style="color:var(--muted);font-size:14px">This is a sample shop, so the order was not sent to a real kitchen.</p></div>';
    f.innerHTML='<button class="main" id="again">Back to menu</button>';return;
  }
  if(view==="checkout"){
    $("title").textContent="Checkout";
    b.innerHTML='<form id="form" novalidate>'+
     '<label>How would you like it?</label><div class="seg"><label><input type="radio" name="mode" value="delivery" checked><span>Delivery</span></label><label><input type="radio" name="mode" value="pickup"><span>Pickup</span></label></div>'+
     '<label for="name">Name</label><input id="name" autocomplete="name"><div class="err" id="e-name"></div>'+
     '<label for="phone">Phone number</label><input id="phone" type="tel" inputmode="tel" autocomplete="tel"><div class="err" id="e-phone"></div>'+
     '<div id="addrbox"><label for="addr">Delivery address</label><textarea id="addr" rows="3" autocomplete="street-address"></textarea><div class="err" id="e-addr"></div></div>'+
     '<label for="note">Note for the kitchen (optional)</label><input id="note"></form>';
    drawTotals("delivery",'Place order','place');return;
  }
  $("title").textContent="Your cart";
  if(!list.length){b.innerHTML='<div class="empty">Your cart is empty.<br>Add something from the menu to get started.</div>';f.innerHTML='';return;}
  b.innerHTML=list.map(function(x){return '<div class="line"><b>'+x.m.n+'</b><b>'+money(x.m.p*x.q)+'</b><small>'+money(x.m.p)+' each</small><div class="qty"><button data-dec="'+x.m.id+'" aria-label="Remove one">−</button><b>'+x.q+'</b><button data-inc="'+x.m.id+'" aria-label="Add one">+</button></div></div>'}).join("");
  drawTotals("delivery",'Go to checkout','checkout');
}
function drawTotals(mode,label,act){
  var t=totals(mode),hint=(mode==="delivery"&&t.s<FREE_AT)?'<small style="color:var(--muted)">Add '+money(FREE_AT-t.s)+' more for free delivery.</small>':'';
  $("foot").innerHTML='<div class="tot"><span>Subtotal</span><span>'+money(t.s)+'</span></div><div class="tot"><span>Delivery</span><span id="fee">'+(t.f?money(t.f):"Free")+'</span></div>'+hint+'<div class="tot big"><span>Total</span><span id="tt">'+money(t.t)+'</span></div><button class="main" data-act="'+act+'">'+label+'</button>'+(act==="place"?'<button class="main" style="background:var(--bg);color:var(--ink)" data-act="back">Back to cart</button>':'');
}
function refresh(){
  var c=count();$("count").textContent=c;renderMenu();save();
  if(view!=="checkout"||!c){if(!c&&view==="checkout")view="cart";renderDrawer();}
}
function change(id,d){cart[id]=Math.max(0,(cart[id]||0)+d);if(!cart[id])delete cart[id];refresh()}
function openD(){$("drawer").classList.add("on");$("scrim").classList.add("on");$("drawer").setAttribute("aria-hidden","false");renderDrawer();$("close").focus()}
function closeD(){$("drawer").classList.remove("on");$("scrim").classList.remove("on");$("drawer").setAttribute("aria-hidden","true");if(view==="done")view="cart";$("open").focus()}

function place(){
  var mode=document.querySelector('input[name="mode"]:checked').value;
  var n=$("name").value.trim(),p=$("phone").value.replace(/[\s-]/g,""),a=$("addr").value.trim(),ok=true;
  $("e-name").textContent=n?"":"Enter your name.";if(!n)ok=false;
  var pv=/^(\+?\d{1,3})?\d{10}$/.test(p);$("e-phone").textContent=pv?"":"Enter a 10-digit phone number.";if(!pv)ok=false;
  $("e-addr").textContent=(mode==="pickup"||a)?"":"Enter a delivery address.";if(mode==="delivery"&&!a)ok=false;
  if(!ok)return;
  lastOrder={no:"TL-"+Math.floor(1000+Math.random()*9000),name:n.split(" ")[0],mode:mode,total:totals(mode).t};
  cart={};view="done";refresh();
}

document.addEventListener("click",function(e){
  var t=e.target.closest("button");if(!t)return;
  if(t.dataset.c){cat=t.dataset.c;renderChips();renderMenu();}
  else if(t.dataset.inc)change(t.dataset.inc,1);
  else if(t.dataset.dec)change(t.dataset.dec,-1);
  else if(t.id==="open")openD();
  else if(t.id==="close")closeD();
  else if(t.id==="again"){view="cart";closeD();document.getElementById("menu").scrollIntoView();}
  else if(t.dataset.act==="checkout"){view="checkout";renderDrawer();}
  else if(t.dataset.act==="back"){view="cart";renderDrawer();}
  else if(t.dataset.act==="place")place();
});
document.addEventListener("change",function(e){
  if(e.target.name==="mode"){var m=e.target.value,t=totals(m);
    $("addrbox").style.display=m==="pickup"?"none":"block";
    $("fee").textContent=t.f?money(t.f):"Free";$("tt").textContent=money(t.t);}
});
$("scrim").addEventListener("click",closeD);
document.addEventListener("keydown",function(e){if(e.key==="Escape"&&$("drawer").classList.contains("on"))closeD()});

renderChips();refresh();
