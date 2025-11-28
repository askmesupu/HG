// Function to load watches from JSON
async function loadWatches(type, containerId) {
    let container = document.getElementById(containerId);
    container.innerHTML = '';

    let indexJson = `Watch-Collection/${type}/index.json`;
    let response = await fetch(indexJson);
    let watchList = await response.json();

    for (let watchName of watchList) {
        let watchJson = `Watch-Collection/${type}/${watchName}/watch.json`;
        let res = await fetch(watchJson);
        let watchData = await res.json();

        let card = document.createElement('div');
        card.className = 'watch-card';
        card.innerHTML = `
            <img src="${watchData.image}" alt="${watchData.name}">
            <h3>${watchData.name}</h3>
            <p>${watchData.price} BDT</p>
            <button ${watchData.stock === 0 ? 'disabled style="opacity:0.5"' : ''}>Add to Cart</button>
        `;
        container.appendChild(card);
    }
}

// Homepage load
document.addEventListener('DOMContentLoaded', () => {
    loadWatches('Top-Selling','watch-container');
    loadWatches('Men','watch-container-men');
    loadWatches('Women','watch-container-women');
    loadWatches('Popular','watch-container-popular');
});
