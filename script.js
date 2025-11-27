// Sidebar Toggle
function toggleSidebar(){
    const sidebar = document.getElementById("sidebar");
    sidebar.style.left = (sidebar.style.left==='0px' ? '-250px' : '0px');
}

// Cart in localStorage
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Add to cart function
function addToCart(watch){
    if(!cart.find(item=>item.path===watch.path)){
        cart.push(watch);
        localStorage.setItem('cart', JSON.stringify(cart));
        alert(`${watch.name} added to cart!`);
    } else alert(`${watch.name} is already in cart`);
}

// Load watches dynamically
const categories = ['Top-Selling','New-Arrival','Men','Women','Popular'];

categories.forEach(cat=>{
    fetch(`Watch-Collection/${cat}/index.json`)
    .then(res=>res.json())
    .then(data=>{
        data.products.forEach(path=>{
            fetch(`${path}/watch.json`)
            .then(res=>res.json())
            .then(watch=>{
                watch.path = path; // add path for cart & detail
                const sectionId = cat==='Top-Selling'?'top-selling':cat.toLowerCase();
                const container = document.querySelector(`#${sectionId} .product-grid`) || document.querySelector(`#${sectionId} .product-carousel`);
                if(container){
                    const card = document.createElement('div');
                    card.className='product-card';
                    card.innerHTML=`
                        <img src="${watch.img}" alt="${watch.name}">
                        <h3>${watch.brand} - ${watch.name}</h3>
                        <p class="price">${watch.price} BDT</p>
                        <button ${watch.stock?``:`class="disabled" disabled"}>${watch.stock?"Add to Cart":"Out of Stock"}</button>
                        <a class="details" href="watch.html?path=${encodeURIComponent(path)}">View Details</a>
                    `;
                    container.appendChild(card);
                    if(watch.stock){
                        card.querySelector('button').addEventListener('click',()=>addToCart(watch));
                    }
                }
            });
        });
    });
});
