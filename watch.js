async function loadWatches(sectionId, category) {
const container = document.getElementById(sectionId);
try {
const indexRes = await fetch("Watch-Collection/${category}/index.json");
const indexData = await indexRes.json();

    for (const watchFolder of indexData) {
        const watchRes = await fetch(`Watch-Collection/${category}/${watchFolder}/watch.json`);
        const watchData = await watchRes.json();

        const card = document.createElement('div');
        card.className = 'watch-card';

        const img = document.createElement('img');
        img.src = watchData.images[0];
        card.appendChild(img);

        const h3 = document.createElement('h3');
        h3.textContent = watchData.name;
        card.appendChild(h3);

        const p = document.createElement('p');
        p.textContent = `$${watchData.price}`;
        card.appendChild(p);

        container.appendChild(card);
    }
} catch (err) {
    console.error('Error loading watches', err);
}

}

loadWatches('top-selling', 'Top-Selling');
loadWatches('men-watch', 'Men');
loadWatches('women-watch', 'Women');
loadWatches('popular-watch', 'Popular');
