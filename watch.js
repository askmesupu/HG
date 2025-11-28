(() => {
  function $ (s){ return document.querySelector(s) }

  document.addEventListener('DOMContentLoaded', () => {
    // open/close sidebar buttons also present here
    const overlay = document.getElementById('overlay');
    const sidebar = document.getElementById('sidebar');
    const menuOpeners = Array.from(document.querySelectorAll('#menuBtn, #menuBtnDetail, #menuBtnCart'));
    menuOpeners.forEach(b=> b && b.addEventListener('click', ()=>{ sidebar.classList.add('show'); overlay.classList.add('show'); }));

    const closeBtns = Array.from(document.querySelectorAll('#closeSidebarDetail, #closeSidebar, #closeSidebarCart, .sidebar-close'));
    closeBtns.forEach(b=> b && b.addEventListener('click', ()=>{ sidebar.classList.remove('show'); overlay.classList.remove('show'); }));

    overlay && overlay.addEventListener('click', ()=>{ sidebar.classList.remove('show'); overlay.classList.remove('show'); });

    const params = new URLSearchParams(location.search);
    const path = params.get('path');
    if(!path){
      // nothing selected — redirect home
      console.warn('No product path provided');
      return;
    }

    fetch(`${path}/watch.json`).then(r=>{
      if(!r.ok) throw new Error('watch.json not found');
      return r.json();
    }).then(watch => {
      // Gallery
      const gallery = $(`#gallery`);
      const thumbs = $(`#thumbs`);
      gallery.innerHTML = '';
      thumbs.innerHTML = '';

      const images = Array.isArray(watch.images) && watch.images.length ? watch.images : (watch.img ? [watch.img] : []);
      images.forEach((src, i) => {
        const img = document.createElement('img');
        img.src = src;
        img.alt = `${watch.name} ${i+1}`;
        img.loading = 'lazy';
        gallery.appendChild(img);

        const t = document.createElement('img');
        t.src = src;
        t.alt = `${watch.name} thumb ${i+1}`;
        t.loading = 'lazy';
        if(i===0) t.classList.add('active');
        t.addEventListener('click', ()=> {
          // scroll gallery to selected image
          const rect = img.getBoundingClientRect();
          img.scrollIntoView({behavior:'smooth', inline:'center'});
          thumbs.querySelectorAll('img').forEach(x=>x.classList.remove('active'));
          t.classList.add('active');
        });
        thumbs.appendChild(t);
      });

      // Text fields
      $(`#product-name`).innerText = watch.name;
      $(`#product-brand`).innerText = watch.brand || '';
      $(`#product-desc`).innerText = watch.description || '';

      // price area and discount
      const priceArea = $(`#price-area`);
      let final = watch.price || 0;
      if(typeof watch.discount === 'number' && watch.discount > 0){
        final = Math.round(final - (final * watch.discount / 100));
        priceArea.innerHTML = `<span class="old">৳${Number(watch.price).toLocaleString('en-US')}</span><span class="now">৳${Number(final).toLocaleString('en-US')}</span>`;
      } else {
        priceArea.innerHTML = `<span class="now">৳${Number(final).toLocaleString('en-US')}</span>`;
      }

      // stock
      const badge = document.getElementById('badge-stock');
      const addBtn = document.getElementById('add-to-cart');
      const buyBtn = document.getElementById('buy-now');
      if(!watch.stock){
        if(badge) badge.hidden = false;
        addBtn.disabled = true; buyBtn.disabled = true;
        addBtn.classList.add('disabled'); buyBtn.classList.add('disabled');
      } else {
        if(badge) badge.hidden = true;
        // wire buttons
        addBtn.addEventListener('click', ()=>{
          window.addToCart({ path, name: watch.name, brand: watch.brand, price: final, img: images[0] || '' });
        });
        buyBtn.addEventListener('click', ()=>{
          // add to cart then go to cart
          window.addToCart({ path, name: watch.name, brand: watch.brand, price: final, img: images[0] || '' });
          location.href = 'cart.html';
        });
      }

      // Observe gallery images (if needed) - no extra
    }).catch(err=>{
      console.error(err);
      alert('Failed to load product.');
      location.href = 'index.html';
    });
  });
})();
