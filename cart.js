function loadCart() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartBox = document.getElementById("cart-items");
    const itemCount = document.getElementById("item-count");
    const totalPrice = document.getElementById("total-price");

    cartBox.innerHTML = "";
    let total = 0;

    if (cart.length === 0) {
        cartBox.innerHTML = `<p class="empty-cart">Your cart is empty.</p>`;
        itemCount.textContent = "0";
        totalPrice.textContent = "৳0";
        return;
    }

    cart.forEach((item, index) => {
        total += item.price;

        const box = document.createElement("div");
        box.classList.add("cart-card");

        box.innerHTML = `
            <img src="${item.image}">
            <div class="cart-info">
                <h3>${item.name}</h3>
                <p class="cart-price">৳${item.price}</p>
                <button class="remove-btn" onclick="removeItem(${index})">Remove</button>
            </div>
        `;

        cartBox.appendChild(box);
    });

    itemCount.textContent = cart.length;
    totalPrice.textContent = "৳" + total;
}

function removeItem(i) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.splice(i, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    loadCart();
}

document.getElementById("clear-cart").addEventListener("click", () => {
    localStorage.removeItem("cart");
    loadCart();
});

document.getElementById("checkout-btn").addEventListener("click", () => {
    window.location.href = "order.html";  // or your order form page
});

loadCart();
