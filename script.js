// Global script for sidebar, reveal animations, and cart page rendering
(() => {
  const overlay = document.getElementById('overlay');
  const sidebar = document.getElementById('sidebar');

  // menu buttons may appear with different IDs on pages
  const menuBtns = Array.from(document.querySelectorAll('#menuBtn, #menuBtnDetail, #menuBtnCart'));
  const closeBtns = Array.from(document.querySelectorAll('#closeSidebar, #closeSidebarDetail, #closeSidebarCart, .sidebar-close'));

  menuBtns.forEach(btn=>{
    if(!btn) return;
    btn.addEventListener('click', () => {
      btn.classList.toggle('active');
      sidebar.classList.add('show');
      overlay.classList.add('show');
      sidebar.setAttribute('aria-hidden', 'false');
      overlay.setAttribute('aria-hidden','false');
    });
  });

  closeBtns.forEach(btn=>{
    if(!btn) return;
    btn.addEventListener('click', () => {
      sidebar.classList.remove('show');
      overlay.classList.remove('show');
      document.querySelectorAll('.menu-btn').forEach(b=>b.classList.remove('active'));
      sidebar.setAttribute('aria-hidden','true');
      overlay.setAttribute('aria-hidden','true');
    });
  });

  overlay && overlay.addEventListener('click', ()=> {
    sidebar.classList.remove('show');
    overlay.classList.remove('show');
    document.querySelectorAll('.menu-btn').forEach(b=>b.classList.remove('active'));
    sidebar.setAttribute('aria-hidden','true');
    overlay.setAttribute('aria-hidden','true');
  });

  // Intersection Observer for reveal animation
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add('show');
        io.unobserve(entry.target);
      }
    });
  }, {threshold: 0.12});

  // observe product cards added later
  window.observeReveals = function(selector = '.product-card, .product-card, .product-card') {
    document.querySelectorAll(selector).forEach(el=>{
      el.classList.add('reveal');
      io.observe(el);
    });
  };

  // --- CART helpers (shared) ---
  const CART_KEY = 'hg_cart_v1';
  window.readCart = () => JSON.parse(localStorage.getItem(CART_KEY) || '[]');
  window.writeCart = (cart) => localStorage.setItem(CART_KEY, JSON.stringify(cart));

  window.addToCart = (item) => {
    const cart = readCart();
    const found = cart.find(i => i.path === item.path);
    if(found) found.qty = (found.qty||1) + 1;
    else cart.push(Object.assign({ qty: 1 }, item));
    writeCart(cart);
    // nice lightweight UI feedback
    alert(`${item.name} added to cart`);
  };

  // If on cart page, render cart
  if(location.pathname.endsWith('cart.html') || location.pathname.endsWith('/cart.html')) {
    renderCartPage();
  }

  function renderCartPage(){
    const container = document.getElementById('cart-container');
    if(!container) return;
    const cart = readCart();
    container.innerHTML = '';
    if(!cart.length){
      container.innerHTML = `<div style="padding:30px;text-align:center;color:var(--muted)">Your cart is empty.</div>`;
      document.getElementById('cart-total').innerText = '0 BDT';
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
    document.getElementById('cart-total').innerText = `${total.toLocaleString('en-US')} BDT`;

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
      // Proceed to checkout (placeholder for COD/bKash)
      alert('Proceed to order (COD/bKash) - implement your order form next.');
      // Optionally redirect to an order form page
    };
  }

  function escapeHtml(s){ return String(s).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])) }
})();
