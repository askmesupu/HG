// Load watches from JSON dynamically
async function loadWatches(category, gridId){
    const grid = document.getElementById(gridId);
    try{
        const res = await fetch(`Watch-Collection/${category}/index.json`);
        const data = await res.json();
        data.forEach(watch=>{
            const card = document.createElement('div');
            card.className='card fade-in';
            card.innerHTML=`
                <img src="${watch.image}" alt="${watch.name}">
                <h3>${watch.name}</h3>
                <p class="price">${watch.price}</p>
                <button onclick="addToCart('${watch.name}','${watch.price}')">Add to Cart</button>
            `;
            grid.appendChild(card);
        });
    }catch(err){
        console.log(err);
    }
}

// Cart
function addToCart(name, price){
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cart.push({name, price});
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${name} added to cart`);
}

// Initialize
loadWatches('Top-Selling','top-selling-grid');
loadWatches('Men','men-grid');
loadWatches('Women','women-grid');
loadWatches('Popular','popular-grid');
