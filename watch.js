const watchContainer = document.getElementById('watch-container');
const categoryTitle = document.getElementById('category-title');
const cartContainer = document.getElementById('cart-container');

const urlParams = new URLSearchParams(window.location.search);
const category = urlParams.get('category') || 'Top-Selling';

if (categoryTitle) categoryTitle.textContent = category;

const cart = JSON.parse(localStorage.getItem('hourglassCart') || '[]');

async function loadWatches() {
    let jsonPath = '';
    if(category === 'Top-Selling') jsonPath = 'Watch-Collection/Top-Selling/index.json';
    else if(category === 'Men') jsonPath = 'Watch-Collection/Men/index.json';
    else if(category === 'Women') jsonPath = 'Watch-Collection/Women/index.json';
    else if(category === 'Popular') jsonPath = 'Watch-Collection/Popular/index.json';

    try {
        const res = await fetch(jsonPath);
        const data = await res.json();
        displayWatches(data);
    } catch(err) {
        watchContainer.innerHTML = '<p>No watches found.</p>';
    }
}

function displayWatches(data){
    if(!watchContainer) return;
    watchContainer.innerHTML = '';
    data.forEach(watch => {
        const card = document.createElement('div');
        card.className = 'watch-card';
        card.innerHTML = `
        <img src="${watch.image}" alt="${watch.name}">
        <h3>${watch.name}</h3>
        <p>${watch.brand}</p>
        <p>${watch.stock === 0 ? 'Out of Stock' : '$'+watch.price}</p>
        <button ${watch.stock===0 ? 'disabled' : ''} onclick="addToCart('${watch.name}', ${watch.price})">Add to Cart</button>
        `;
        watchContainer.appendChild(card);
    });
}

function addToCart(name, price){
    cart.push({name, price});
    localStorage.setItem('hourglassCart', JSON.stringify(cart));
    alert(name + ' added to cart');
}

// Load cart
function loadCart(){
    if(!cartContainer) return;
    cartContainer.innerHTML = '';
    if(cart.length===0){cartContainer.innerHTML = '<p>Cart is empty</p>'; return;}
    cart.forEach((item,index)=>{
        const div = document.createElement('div');
        div.innerHTML = `<p>${item.name} - $${item.price}</p>`;
        cartContainer.appendChild(div);
    });
}

if(window.location.pathname.includes('cart.html')){
    loadCart();
    document.getElementById('clear-cart').addEventListener('click',()=>{
        localStorage.removeItem('hourglassCart');
        loadCart();
    });
    document.getElementById('checkout').addEventListener('click',()=>{
        alert('Order placed! COD / bKash');
        localStorage.removeItem('hourglassCart');
        loadCart();
    });
}

loadWatches();
