(() => {
  function $ (sel){ return document.querySelector(sel) }
  function readCart(){ return JSON.parse(localStorage.getItem('hg_cart_v1') || '[]') }
  function writeCart(c){ localStorage.setItem('hg_cart_v1', JSON.stringify(c)) }

  document.addEventListener('DOMContentLoaded', () => {
    // sidebar wiring on this page too (IDs used in script.js)
    const overlay = document.getElementById('overlay');
    const sidebar = document.getElementById('sidebar');
    $all('#openSidebarDetail, #openSidebar, #openSidebarCart').forEach(btn=>{
      if(btn) btn.addEventListener('click', ()=>{ sidebar.classList.add('show'); overlay.classList.add('show'); })
    });
    $all('#closeSidebarDetail, #closeSidebar, #closeSidebarCart').forEach(btn=>{
      if(btn) btn.addEventListener('click', ()=>{ sidebar.classList.remove('show'); overlay.classList.remove('show'); })
    });
    overlay && overlay.addEventListener('click', ()=>{ sidebar.classList.remove('show'); overlay.classList.remove('show'); });

    // read path param
    const params = new URLSearchParams(location.search);
    const p = params.get('path');
    if(!p){ alert('Product not specified'); location.href = 'index.html'; return; }

    fetch(`${p}/watch.json`).then(r=>{
      if(!r.ok) throw new Error('watch.json not found');
      return r.json();
    }).then(watch => {
      $('#product-img').src = watch.img;
      $('#product-name').innerText = watch.name;
      $('#product-brand').innerText = watch.brand;
      $('#product-desc').innerText = watch.description;
      $('#product-price').innerText = `${Number(watch.price).toLocaleString('en-US')} BDT`;

      const badge = $('#badge-stock');
      if(!watch.stock){
        badge.hidden = false;
        $('#add-to-cart').disabled = true;
        $('#buy-now').disabled = true;
        $('#add-to-cart').classList.add('disabled');
      } else {
        badge.hidden = true;
        $('#add-to-cart').addEventListener('click', ()=>{
          const cart = readCart();
          const exists = cart.find(i => i.path === p);
          if(exists) exists.qty = (exists.qty || 1) + 1;
          else cart.push({ path: p, name: watch.name, brand: watch.brand, price: watch.price, img: watch.img, qty:1 });
          writeCart(cart);
          alert(watch.name + ' added to cart');
        });
        $('#buy-now').addEventListener('click', ()=>{
          const cart = readCart();
          const exists = cart.find(i => i.path === p);
          if(!exists){
            cart.push({ path: p, name: watch.name, brand: watch.brand, price: watch.price, img: watch.img, qty:1 });
            writeCart(cart);
          }
          // redirect to cart to checkout
          location.href = 'cart.html';
        });
      }
    }).catch(err=>{
      console.error(err);
      alert('Failed to load product.');
      location.href = 'index.html';
    });

    // helper to select many
    function $all(sel){ return Array.from(document.querySelectorAll(sel)) }
  });
})();
