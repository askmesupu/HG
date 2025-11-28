async function loadCategory(categoryId, containerId){
    try{
        const response = await fetch(`Watch-Collection/${categoryId}/index.json`);
        const data = await response.json();
        const container = document.getElementById(containerId);
        container.innerHTML = '';
        data.forEach(watch=>{
            const card = document.createElement('div');
            card.className='card fade-in';
            card.innerHTML=`
                <img src="${watch.image}" alt="${watch.name}">
                <h3>${watch.name}</h3>
                <p>${watch.brand}</p>
                <p class="price">${watch.discount? `<del>${watch.price}</del> ${watch.discountedPrice}` : watch.price}</p>
                <button ${watch.stock=="out"?'disabled style="opacity:0.5;cursor:not-allowed"':''}>Add to Cart</button>
            `;
            container.appendChild(card);
        });
    }catch(e){
        console.error(e);
    }
}

// Load all sections
loadCategory('Top-Selling','top-selling-grid');
loadCategory('Men','men-grid');
loadCategory('Women','women-grid');
loadCategory('Popular','popular-grid');
