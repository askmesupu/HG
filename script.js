// script.js - global behavior for homepage, cart, sidebar, reveal, addToCart
(() => {
  const OVERLAY = document.getElementById('overlay');
  const SIDEBAR = document.getElementById('sidebar');
  const MENU_BTN = document.getElementById('menuBtn');
  const CLOSE_BTN = document.getElementById('closeSidebar');
  const CLOSE_CART_BTN = document.getElementById('closeSidebarCart');
  const CLOSE_DETAIL_BTN = document.getElementById('closeSidebarDetail');

  // toggle sidebar
  function openSidebar(btn){
    if(!SIDEBAR) return;
    SIDEBAR.classList.add('show');
    OVERLAY.classList.add('show');
    if(btn) btn.classList.add('open');
    document.querySelectorAll('.menu-btn').forEach(b=>b && b.classList.add('open'));
  }
  function closeSidebarAll(){
    if(!SIDEBAR) return;
    SIDEBAR.classList.remove('show');
    OVERLAY.classList.remove('show');
    document.querySelectorAll('.menu-btn').forEach(b=>b && b.classList.remove('open'));
  }

  // menu buttons
  document.addEventListener('DOMContentLoaded', ()=>{
    Array.from(document.querySelectorAll('#menuBtn, #menuBtnCart, #menuBtnDetail')).forEach(btn=>{
      if(!btn) return;
      btn.addEventListener('click', ()=> openSidebar(btn));
    });
    Array.from(document.querySelectorAll('#closeSidebar, #closeSidebarCart, #closeSidebarDetail, .sidebar-close')).forEach(b=>{
      if(!b) return;
      b.addEventListener('click', closeSidebarAll);
    });
    OVERLAY && OVERLAY.addEventListener('click', closeSidebarAll);
  });

  // IntersectionObserver reveal
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        e.target.classList.add('show');
        io.unobserve(e.target);
      }
    });
  },{threshold:0.12});

  window.observeReveals = function(selector = '.product-card, .product-card, .product-card, .reveal') {
    document.querySelectorAll(selector).forEach(el=>{
      el.classList.add('reveal');
      io.observe(el);
    });
  };

  // CART helpers
  const CART_KEY = 'hg_cart_v2';
  window.readCart = () => JSON.parse(localStorage.getItem(CART_KEY) || '[]');
  window.writeCart = (c) => localStorage.setItem(CART_KEY, JSON.stringify(c));

  window.addToCart = (item) => {
    const cart = readCart();
    const found = cart.find(i => i.path === item.path);
    if(found) found.qty = (found.qty||1) + 1;
    else cart.push(Object.assign({ qty:1 }, item));
    writeCart(cart);
    // small toast fallback
    try { window.navigator.vibrate && window.navigator.vibrate(50); } catch(e){}
    alert(`${item.name} added to cart`);
  };

  // render cart when on cart page
  function renderCartPage(){
    const container = document.getElementById('cart-container');
    if(!container) return;
    const cart = readCart();
    container.innerHTML = '';
    if(!cart.length){
      container.innerHTML = `<div style="padding:24px;text-align:center;color:var(--muted)">Your cart is empty.</div>`;
      document.getElementById('cart-total') && (document.getElementById('cart-total').innerText = '0 BDT');
      return;
    }
    let total = 0;
    cart.forEach((it, idx)=>{
      total += (Number(it.price)||0) * (it.qty||1);
      const el = document.createElement('div');
      el.className = 'cart-item';
      el.innerHTML = `
        <img src="${it.img}" alt="${escapeHtml(it.name)}">
        <div class="cart-meta">
          <h4>${escapeHtml(it.brand)} — ${escapeHtml(it.name)}</h4>
          <div style="color:var(--muted);margin-top:6px">${Number(it.price).toLocaleString('en-US')} BDT</div>
          <div class="qty-controls">
            <button data-idx="${idx}" data-op="-" class="qty-btn">-</button>
            <div style="min-width:34px;text-align:center">${it.qty}</div>
            <button data-idx="${idx}" data-op="+" class="qty-btn">+</button>
            <button data-idx="${idx}" class="remove-item" style="margin-left:10px">Remove</button>
          </div>
        </div>
      `;
      container.appendChild(el);
    });
    document.getElementById('cart-total') && (document.getElementById('cart-total').innerText = `${total.toLocaleString('en-US')} BDT`);

    // attach events
    container.querySelectorAll('.qty-btn').forEach(b=>{
      b.addEventListener('click', ()=>{
        const idx = Number(b.dataset.idx);
        const op = b.dataset.op;
        const cart = readCart();
        if(op === '-' && cart[idx].qty > 1) cart[idx].qty--;
        if(op === '+') cart[idx].qty++;
        writeCart(cart);
        renderCartPage();
      });
    });
    container.querySelectorAll('.remove-item').forEach(b=>{
      b.addEventListener('click', ()=>{
        const idx = Number(b.dataset.idx);
        const cart = readCart();
        cart.splice(idx,1);
        writeCart(cart);
        renderCartPage();
      });
    });

    const clearBtn = document.getElementById('clear-cart');
    if(clearBtn) clearBtn.onclick = () => {
      if(confirm('Clear cart?')){ writeCart([]); renderCartPage(); }
    };

    const checkout = document.getElementById('checkout-btn');
    if(checkout) checkout.onclick = () => {
      alert('Proceed to order (COD / bKash to be implemented).');
    };
  }

  document.addEventListener('DOMContentLoaded', ()=>{
    renderCartPage();
    // observe any reveals on load
    window.observeReveals();
  });

  // small escape util
  function escapeHtml(s){ return String(s).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])) }

})();
