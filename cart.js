function getCart(){return JSON.parse(localStorage.getItem('hourglassCart') || '[]');}
function saveCart(cart){localStorage.setItem('hourglassCart', JSON.stringify(cart));}

function addToCart(category, folder){
    let cart = getCart();
    const existing = cart.find(i=>i.category===category && i.folder===folder);
    if(existing){alert("Already in cart"); return;}
    cart.push({category,folder,qty:1});
    saveCart(cart);
    alert("Added to cart");
}

function loadCart(){
    const cartContainer = document.getElementById('cart-container');
    const cart = getCart();
    cartContainer.innerHTML='';
    if(cart.length==0){cartContainer.innerHTML='<p>Your cart is empty</p>'; return;}

    cart.forEach(async item=>{
        const res = await fetch(`Watch-Collection/${item.category}/${item.folder}/watch.json`);
        const watch = await res.json();

        const div = document.createElement('div');
        div.className='cart-item';
        div.innerHTML=`
            <img src="${watch.images[0]}" alt="${watch.name}" width="80">
            <p>${watch.name}</p>
            <p>${watch.discount ? watch.discountedPrice : watch.price}</p>
            <button onclick="removeFromCart('${item.category}','${item.folder}')">Remove</button>
        `;
        cartContainer.appendChild(div);
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

// Call on cart page load
if(document.getElementById('cart-container')){
    loadCart();
}
