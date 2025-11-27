// Sidebar Toggle
function toggleSidebar(){
    const sidebar = document.getElementById("sidebar");
    sidebar.style.left = (sidebar.style.left==='0px')?'-250px':'0px';
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
                const sectionId = cat==='Top-Selling'?'top-selling':cat.toLowerCase();
                const container = document.querySelector(`#${sectionId} .product-grid`) || document.querySelector(`#${sectionId} .product-carousel`);
                if(container){
                    const card = document.createElement('div');
                    card.className = 'product-card';
                    card.innerHTML=`
                        <img src="${watch.img}" alt="${watch.name}">
                        <h3>${watch.brand} - ${watch.name}</h3>
                        <p class="price">${watch.price} BDT</p>
                        <button ${watch.stock?``:`class="disabled" disabled`}>${watch.stock?"Add to Cart":"Out of Stock"}</button>
                        <a class="details" href="#">Details</a>
                    `;
                    container.appendChild(card);
                }
            });
        });
    });
});
