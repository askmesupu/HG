async function loadCategory(categoryId, containerId){
    try{
        const indexRes = await fetch(`Watch-Collection/${categoryId}/index.json`);
        const watchFolders = await indexRes.json();
        const container = document.getElementById(containerId);
        container.innerHTML='';

        for(const folder of watchFolders){
            const res = await fetch(`Watch-Collection/${categoryId}/${folder}/watch.json`);
            const watch = await res.json();

            const card = document.createElement('div');
            card.className='card fade-in';

            // Multiple images carousel
            let imagesHtml = '';
            if(watch.images && watch.images.length>0){
                imagesHtml = '<div class="carousel">';
                watch.images.forEach(img=>{
                    imagesHtml += `<img src="${img}" alt="${watch.name}">`;
                });
                imagesHtml += '</div>';
            } else {
                imagesHtml = `<img src="${watch.image}" alt="${watch.name}">`;
            }

            card.innerHTML=`
                ${imagesHtml}
                <h3>${watch.name}</h3>
                <p>${watch.brand}</p>
                <p class="price">${watch.discount ? `<del>${watch.price}</del> ${watch.discountedPrice}` : watch.price}</p>
                <button ${watch.stock=="out" ? 'disabled style="opacity:0.5;cursor:not-allowed"' : ''} onclick="addToCart('${categoryId}','${folder}')">Add to Cart</button>
            `;
            container.appendChild(card);
        }

    }catch(e){
        console.error(e);
    }
}

// Load all categories
loadCategory('Top-Selling','top-selling-grid');
loadCategory('Men','men-grid');
loadCategory('Women','women-grid');
loadCategory('Popular','popular-grid');
