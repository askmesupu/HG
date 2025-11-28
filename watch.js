// watch.js - reads ?path=Watch-Collection/Category/brand and loads watch.json
(() => {
  function $ (s){ return document.querySelector(s) }
  function $all(s){ return Array.from(document.querySelectorAll(s)) }

  document.addEventListener('DOMContentLoaded', ()=> {
    // sidebar handlers present via script.js (menu buttons)
    const params = new URLSearchParams(location.search);
    const path = params.get('path');
    if(!path) {
      // no product specified — redirect home
      // console.warn('No product path provided'); 
      return;
    }

    fetch(`${path}/watch.json`).then(r=> {
      if(!r.ok) throw new Error('watch.json not found');
      return r.json();
    }).then(watch => {
      const images = (Array.isArray(watch.images) && watch.images.length) ? watch.images : (watch.img ? [watch.img] : []);
      const gallery = $('#gallery'), thumbs = $('#thumbs');
      gallery.innerHTML = ''; thumbs.innerHTML = '';

      images.forEach((src, i) => {
        const img = document.createElement('img');
        img.src = src;
        img.alt = `${watch.name} ${i+1}`;
        img.loading = 'lazy';
        gallery.appendChild(img);

        const t = document.createElement('img');
        t.src = src;
        t.alt = `thumb ${i+1}`;
        t.loading = 'lazy';
        if(i===0) t.classList.add('active');
        t.addEventListener('click', ()=> {
          img.scrollIntoView({behavior:'smooth', inline:'center'});
          thumbs.querySelectorAll('img').forEach(x=>x.classList.remove('active'));
          t.classList.add('active');
        });
        thumbs.appendChild(t);
      });

      $('#product-name').innerText = watch.name || '';
      $('#product-brand').innerText = watch.brand || '';
      $('#product-desc').innerText = watch.description || '';

      // price & discount
      let final = watch.price || 0;
      if(typeof watch.discount === 'number' && watch.discount > 0){
        final = Math.round(final - (final * watch.discount / 100));
        $('#price-area').innerHTML = `<span class="old">৳${Number(watch.price).toLocaleString('en-US')}</span><span class="now">৳${Number(final).toLocaleString('en-US')}</span>`;
      } else {
        $('#price-area').innerHTML = `<span class="now">৳${Number(final).toLocaleString('en-US')}</span>`;
      }

      // stock
      const addBtn = $('#add-to-cart'), buyBtn = $('#buy-now');
      if(!watch.stock){
        addBtn.disabled = true; buyBtn.disabled = true;
        // show badge if desired (could implement)
      } else {
        addBtn.addEventListener('click', ()=> {
          window.addToCart({ path, name:watch.name, brand:watch.brand, price: final, img: images[0] || '' });
        });
        buyBtn.addEventListener('click', ()=> {
          window.addToCart({ path, name:watch.name, brand:watch.brand, price: final, img: images[0] || '' });
          location.href = 'cart.html';
        });
      }

    }).catch(err=>{
      console.error(err);
      alert('Failed to load product');
      location.href = 'index.html';
    });
  });
})();
