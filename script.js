// Toggle sidebar
function toggleSidebar(hamburger){
    hamburger.classList.toggle('active');
    document.getElementById('sidebar').classList.toggle('active');
}

// Cart localStorage
function getCart(){return JSON.parse(localStorage.getItem('hourglassCart')||'[]');}
function saveCart(cart){localStorage.setItem('hourglassCart', JSON.stringify(cart));}
function addToCart(category, folder){
    let cart = getCart();
    if(cart.find(i=>i.category===category && i.folder===folder)){alert("Already in cart");return;}
    cart.push({category,folder,qty:1});
    saveCart(cart);
    alert("Added to cart");
}

// Cart page
function loadCart(){
    const container = document.getElementById('cart-container');
    const cart = getCart();
    container.innerHTML='';
    if(cart.length==0){container.innerHTML='<p>Your cart is empty</p>'; return;}
    cart.forEach(async item=>{
        const res = await fetch(`Watch-Collection/${item.category}/${item.folder}/watch.json`);
        const watch = await res.json();
        const div = document.createElement('div');
        div.className='cart-item';
        div.innerHTML=`
            <img src="${watch.images[0]}" width="80">
            <p>${watch.name}</p>
            <p>${watch.discount ? watch.discountedPrice : watch.price}</p>
            <button onclick="removeFromCart('${item.category}','${item.folder}')">Remove</button>
        `;
        container.appendChild(div);
    });
}
function removeFromCart(category, folder){
    let cart = getCart();
    cart = cart.filter(i=>!(i.category===category && i.folder===folder));
    saveCart(cart);
    loadCart();
}
function clearCart(){
    localStorage.removeItem('hourglassCart');
    loadCart();
}
if(document.getElementById('cart-container')) loadCart();
