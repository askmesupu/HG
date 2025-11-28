// watch.js

// Identify category from page (data-category attribute on body)
const bodyCategory = document.body.getAttribute("data-category") || "Top-Selling";
const watchContainer = document.getElementById("watch-container");

async function loadWatches(category) {
  try {
    // Fetch JSON from Watch-Collection folder
    const res = await fetch(`/Watch-Collection/${category}/index.json`);
    if (!res.ok) throw new Error("Cannot fetch watch data");
    const categoryData = await res.json();

    if (watchContainer) {
      watchContainer.innerHTML = ""; // clear previous content

      categoryData.forEach((watch, idx) => {
        const card = document.createElement("div");
        card.classList.add("watch-card");

        // Discount handling
        let priceHTML = `$${watch.price}`;
        if (watch.discount) {
          const discounted = watch.price - (watch.price * watch.discount) / 100;
          priceHTML = `<span class="original-price">$${watch.price}</span> <span class="discounted-price">$${discounted}</span>`;
        }

        // Stock handling
        const buyButton = watch.stock > 0
          ? `<button class="buy-now">Buy Now</button>`
          : `<button class="buy-now disabled" disabled>Out of Stock</button>`;

        // Images horizontal scroll
        let imagesHTML = watch.images.map(img => `<img src="${img}" alt="${watch.name}" class="watch-img">`).join("");

        card.innerHTML = `
          <div class="watch-images">${imagesHTML}</div>
          <h3 class="watch-name">${watch.name}</h3>
          <p class="watch-brand">${watch.brand}</p>
          <p class="watch-price">${priceHTML}</p>
          <p class="watch-desc">${watch.description}</p>
          ${buyButton}
        `;
        watchContainer.appendChild(card);
      });
    }
  } catch (err) {
    if (watchContainer) watchContainer.innerHTML = "<p>No watches available.</p>";
    console.error(err);
  }
}

// Load watches for the current page category
loadWatches(bodyCategory);
