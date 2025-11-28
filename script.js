// Sidebar toggle
const hamburger = document.getElementById('hamburger');
const sidebar = document.getElementById('sidebar');
hamburger.addEventListener('click', ()=>{
    hamburger.classList.toggle('active');
    sidebar.classList.toggle('active');
});

// Scroll animation
const faders = document.querySelectorAll('.fade-in');
const appearOptions = { threshold:0.1, rootMargin:"0px 0px -50px 0px" };
const appearOnScroll = new IntersectionObserver(function(entries, observer){
    entries.forEach(entry=>{
        if(!entry.isIntersecting) return;
        entry.target.classList.add('show');
        observer.unobserve(entry.target);
    });
}, appearOptions);
faders.forEach(fader => appearOnScroll.observe(fader));
