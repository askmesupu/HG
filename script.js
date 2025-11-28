// Sidebar toggle
const hamburger = document.getElementById('hamburger');
const sidebar = document.getElementById('sidebar');
hamburger.addEventListener('click', ()=>{
    sidebar.style.left = sidebar.style.left === '0px' ? '-250px' : '0px';
    hamburger.classList.toggle('active');
});

// Scroll animations
const faders = document.querySelectorAll('.fade-in');
const appearOptions = { threshold:0.1 };
const appearOnScroll = new IntersectionObserver(function(entries, observer){
    entries.forEach(entry=>{
        if(entry.isIntersecting){
            entry.target.classList.add('show');
            observer.unobserve(entry.target);
        }
    });
}, appearOptions);

faders.forEach(fader => appearOnScroll.observe(fader));
