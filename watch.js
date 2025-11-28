const categories = ['Top-Selling','Men','Women','Popular'];

categories.forEach(category => {
    const container = document.getElementById(`watch-container${category==='Top-Selling'?'':'-'+category.toLowerCase()}`);
    if (!container) return;

    fetch(`Watch-Collection/${category}/index.json`)
    .then(res => res.json())
    .then(data => {
        data.forEach(watch => {
            const card = document.createElement('div');
            card.className = 'watch-card';
            card.innerHTML = `
                <img src="${watch.img}" alt="${watch.name}">
                <h3>${watch.name}</h3>
                <p>${watch.brand}</p>
                <p>$${watch.price}</p>
                <button onclick="addToCart('${watch.id}','${watch.name}','${watch.price}','${watch.img}')">Add to Cart</button>
            `;
            container.appendChild(card);
        });
    });
});

function addToCart(id, name, price, img) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push({id, name, price, img});
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Added to cart!');
          }
