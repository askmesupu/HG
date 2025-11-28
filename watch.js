async function loadWatches(folder, gridId){
  const res = await fetch(`Watch-Collection/${folder}/index.json`);
  const watches = await res.json();
  const grid = document.getElementById(gridId);
  grid.innerHTML='';
  for(let watch of watches){
    const card = document.createElement('div');
    card.classList.add('watch-card');

    let priceHTML='';
    if(watch.discount && watch.discount>0){
      const discounted = watch.price - (watch.price*watch.discount/100);
      priceHTML = `<span class="original-price">৳${watch.price}</span><span class="discounted-price">৳${discounted}</span>`;
    } else {
      priceHTML = `৳${watch.price}`;
    }

    let stockHTML='';
    if(!watch.stock){
      stockHTML = `<div style="color:red;font-weight:bold;margin-top:5px;">OUT OF STOCK</div>`;
    }

    card.innerHTML=`
      <img src="${watch.images[0]}" alt="${watch.name}">
      <div class="watch-name">${watch.name}</div>
      <div class="watch-price">${priceHTML}</div>
      ${stockHTML}
      <button class="buy-btn" ${!watch.stock?'disabled':''}>Buy Now</button>
    `;
    grid.appendChild(card);
  }
  observeCards(); // attach scroll animation
}

// Load all sections
loadWatches('Top-Selling','top-selling-grid');
loadWatches('Men','men-grid');
loadWatches('Women','women-grid');
loadWatches('Popular','popular-grid');
