/* MAIN APP SCRIPT (index + cart actions) */
(() => {
  // --- Sidebar & overlay controls (robustly attach once DOM loads) ---
  function $(sel){ return document.querySelector(sel) }
  function $all(sel){ return Array.from(document.querySelectorAll(sel)) }

  document.addEventListener('DOMContentLoaded', () => {
    const overlay = $('#overlay');
    const sidebar = $('#sidebar');

    // open buttons (many pages share different ids)
    $all('#openSidebar, #openSidebarCart, #openSidebarDetail').forEach(btn=>{
      btn && btn.addEventListener('click', () => {
        sidebar.classList.add('show');
        overlay.classList.add('show');
        sidebar.setAttribute('aria-hidden','false');
        overlay.setAttribute('aria-hidden','false');
      });
    });

    // close buttons (many pages)
    $all('#closeSidebar, #closeSidebarCart, #closeSidebarDetail').forEach(btn=>{
      btn && btn.addEventListener('click', () => {
        sidebar.classList.remove('show');
        overlay.classList.remove('show');
        sidebar.setAttribute('aria-hidden','true');
        overlay.setAttribute('aria-hidden','true');
      });
    });

    overlay.addEventListener('click', () => {
      sidebar.classList.remove('show');
      overlay.classList.remove('show');
      sidebar.setAttribute('aria-hidden','true');
      overlay.setAttribute('aria-hidden','true');
    });

    // --- Cart store (localStorage) ---
    const CART_KEY = 'hg_cart_v1';
    function readCart(){ return JSON.parse(localStorage.getItem(CART_KEY) || '[]') }
    function writeCart(cart){ localStorage.setItem(CART_KEY, JSON.stringify(cart)) }

    // Add to cart helper
    window.addToCart = function(item){
      const cart = readCart();
      const exists = cart.find(i => i.path === item.path);
      if(exists){
        exists.qty = (exists.qty||1) + 1;
      } else {
        cart.push(Object.assign({ qty: 1 }, item));
      }
      writeCart(cart);
      alert(item.name + ' added to cart.');
    };

    // populate grids (tries to read category index.json in Watch-Collection)
    const categories = [
      { id: 'carousel-top-selling', folder: 'Watch-Collection/Top-Selling' },
      { id: 'grid-men', folder: 'Watch-Collection/Men' },
      { id: 'grid-women', folder: 'Watch-Collection/Women' },
      { id: 'grid-popular', folder: 'Watch-Collection/Popular' }
    ];

    categories.forEach(cat => {
      const container = document.getElementById(cat.id);
      if(!container) return;
      // fetch index.json (must exist)
      fetch(`${cat.folder}/index.json`).then(res=>{
        if(!res.ok) throw new Error('Not found: ' + cat.folder + '/index.json');
        return res.json();
      }).then(idx=>{
        if(!Array.isArray(idx.products)) return;
        idx.products.forEach(p => {
          fetch(`${p}/watch.json`).then(r=>r.json()).then(watch=>{
            // ensure secure img (if no https, still will show but user should replace)
            const card = document.createElement('div');
            card.className = 'product-card';
            const imgHtml = `<img src="${watch.img}" alt="${watch.name}">`;
            const outBadge = watch.stock ? '' : `<div class="badge out-of-stock">OUT OF STOCK</div>`;
            const inner = `
              <div style="position:relative">
                ${imgHtml}
                ${outBadge}
              </div>
              <h3>${escapeHtml(watch.brand)} — ${escapeHtml(watch.name)}</h3>
              <p class="price">${formatPrice(watch.price)} BDT</p>
              <div class="product-actions">
                <button class="btn primary" ${watch.stock ? '' : 'disabled'}>${watch.stock ? 'Add to Cart' : 'Out of Stock'}</button>
                <a class="btn ghost" href="watch.html?path=${encodeURIComponent(p)}">View</a>
              </div>
            `;
            card.innerHTML = inner;
            // append
            container.appendChild(card);
            // attach add to cart
            if(watch.stock){
              const addBtn = card.querySelector('.btn.primary');
              addBtn.addEventListener('click', () => {
                const item = {
                  path: p,
                  name: watch.name,
                  brand: watch.brand,
                  price: watch.price,
                  img: watch.img
                };
                window.addToCart(item);
              });
            }
          }).catch(err=>{
            console.warn('watch.json fetch error', p, err);
          });
        });
      }).catch(err=>{
        console.warn('Category index not found', cat.folder, err);
      });
    });

    // Utility helpers
    function formatPrice(v){ return Number(v).toLocaleString('en-US') }
    function escapeHtml(s){ return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

    // If current page is cart.html (render cart)
    if(document.location.pathname.endsWith('cart.html') || location.pathname.endsWith('/cart.html')){
      renderCartPage();
    }

    function renderCartPage(){
      const container = document.getElementById('cart-container');
      if(!container) return;
      container.innerHTML = '';
      let cart = readCart();
      if(!cart.length){
        container.innerHTML = `<div class="empty" style="padding:30px;text-align:center;color:var(--muted)">Your cart is empty.</div>`;
        document.getElementById('cart-total').innerText = '0 BDT';
        return;
      }
      let total = 0;
      cart.forEach((it, idx) => {
        total += (Number(it.price) || 0) * (it.qty || 1);
        const itemEl = document.createElement('div');
        itemEl.className = 'cart-item';
        itemEl.innerHTML = `
          <img src="${it.img}" alt="${escapeHtml(it.name)}">
          <div class="meta">
            <div style="font-weight:600">${escapeHtml(it.brand)} — ${escapeHtml(it.name)}</div>
            <div style="color:var(--muted);margin-top:6px">${formatPrice(it.price)} BDT</div>
          </div>
          <div class="quantity-control">
            <button class="small-btn" data-idx="${idx}" data-op="-">-</button>
            <div style="min-width:28px;text-align:center">${it.qty}</div>
            <button class="small-btn" data-idx="${idx}" data-op="+">+</button>
            <button class="small-btn remove" data-idx="${idx}" style="margin-left:10px">Remove</button>
          </div>
        `;
        container.appendChild(itemEl);
      });
      document.getElementById('cart-total').innerText = `${formatPrice(total)} BDT`;

      // attach qty buttons
      container.querySelectorAll('.small-btn').forEach(btn => {
        btn.addEventListener('click', e => {
          const idx = Number(btn.dataset.idx);
          const op = btn.dataset.op;
          const cart = readCart();
          if(op === '-' && cart[idx].qty > 1) cart[idx].qty--;
          if(op === '+') cart[idx].qty++;
          writeCart(cart);
          renderCartPage();
        });
      });
      // remove
      container.querySelectorAll('.remove').forEach(btn=>{
        btn.addEventListener('click', ()=>{
          const idx = Number(btn.dataset.idx);
          const cart = readCart();
          cart.splice(idx,1);
          writeCart(cart);
          renderCartPage();
        });
      });

      // checkout & clear handlers
      const checkout = document.getElementById('checkout-btn');
      if(checkout) checkout.onclick = () => {
        alert('Proceed to checkout (COD/bKash placeholder).');
        // later: redirect to checkout form or open order page
      };
      const clearBtn = document.getElementById('clear-cart');
      if(clearBtn) clearBtn.onclick = () => {
        if(confirm('Clear cart?')){
          writeCart([]);
          renderCartPage();
        }
      };
    }
  }); // DOMContentLoaded end
})();
