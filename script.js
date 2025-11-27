// Sidebar toggle
function toggleSidebar() {
    const sidebar = document.getElementById("sidebar");
    if (sidebar.style.width === "250px") {
        sidebar.style.width = "0";
    } else {
        sidebar.style.width = "250px";
    }
}

// ----------- CONFIG: GitHub Repo -----------
// Update these with your own GitHub username and repo
const GITHUB_USER = "YOUR_GITHUB_USERNAME";
const REPO = "HourGlass";
const BRANCH = "main"; // usually main or master

// Categories to fetch
const categories = [
    { name: "Top Selling", path: "Watch-Collection/Popular" },
    { name: "Men's Watch", path: "Watch-Collection/Men" },
    { name: "Women's Watch", path: "Watch-Collection/Women" },
    { name: "New Arrival", path: "Watch-Collection/New-Arrival" }
];

// ----------- HELPER: fetch JSON from GitHub raw URL -----------
async function fetchJSON(path) {
    const url = `https://raw.githubusercontent.com/${GITHUB_USER}/${REPO}/${BRANCH}/${path}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Cannot fetch " + url);
    return await res.json();
}

// ----------- Load all watches -----------
async function loadWatches() {
    for (const cat of categories) {
        try {
            // each category folder should have an index.json listing watch JSON files
            const indexData = await fetchJSON(`${cat.path}/index.json`);
            const containerId = (cat.name === "Top Selling") ? "top-selling" : "all-watches";
            const container = document.getElementById(containerId);

            for (const watchPath of indexData.products) {
                const watch = await fetchJSON(watchPath + "/watch.json"); // watch.json inside each watch folder

                const card = document.createElement("div");
                card.className = "product-card";

                card.innerHTML = `
                    <img src="${watch.img}" alt="${watch.name}">
                    <h3>${watch.brand} - ${watch.name}</h3>
                    <p class="price">${watch.price} BDT</p>
                    <button ${watch.stock ? "" : "class='disabled' disabled"} onclick='addToCart("${watchPath}")'>
                        ${watch.stock ? "Add to Cart" : "Out of Stock"}
                    </button>
                    <a class="details" href="product.html?watch=${encodeURIComponent(watchPath)}">Details</a>
                `;

                container.appendChild(card);
            }

        } catch (err) {
            console.error(err);
        }
    }
}

// ----------- Add to Cart -----------
function addToCart(watchPath) {
    fetchJSON(watchPath + "/watch.json").then(watch => {
        let cart = JSON.parse(localStorage.getItem("hg_cart") || "[]");
        const idx = cart.findIndex(i => i.path === watchPath);
        if (idx >= 0) cart[idx].qty += 1;
        else cart.push({ path: watchPath, qty: 1, name: watch.name, price: watch.price, img: watch.img });
        localStorage.setItem("hg_cart", JSON.stringify(cart));
        alert("Added to Cart");
    }).catch(err => console.error(err));
}

// ----------- Initialize ----------
document.addEventListener("DOMContentLoaded", () => {
    loadWatches();
});
