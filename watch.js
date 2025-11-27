const params = new URLSearchParams(window.location.search);
const path = params.get('path');

if(!path){
    alert("Watch not found");
    window.location.href = "index.html";
}

fetch(`${path}/watch.json`)
.then(res => res.json())
.then(watch => {
    document.getElementById('watch-img').src = watch.img;
    document.getElementById('watch-name').innerText = watch.name;
    document.getElementById('watch-brand').innerText = watch.brand;
    document.getElementById('watch-price').innerText = `${watch.price} BDT`;
    document.getElementById('watch-desc').innerText = watch.description;

    const btn = document.getElementById('buy-btn');
    if(!watch.stock){
        btn.innerText = "Out of Stock";
        btn.disabled = true;
        btn.classList.add("disabled");
    } else {
        btn.addEventListener('click', ()=>{
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            cart.push({...watch, path});
            localStorage.setItem('cart', JSON.stringify(cart));
            alert(`${watch.name} added to cart`);
        });
    }
});
