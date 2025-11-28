// Sidebar toggle
const menuToggle = document.getElementById('menu-toggle');
const sidebar = document.getElementById('sidebar');
const closeSidebar = document.getElementById('close-sidebar');

menuToggle.addEventListener('click', ()=>{
  sidebar.classList.add('show');
});
closeSidebar.addEventListener('click', ()=>{
  sidebar.classList.remove('show');
});

// Scroll Animation for watch cards
const observer = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add('show');
      observer.unobserve(entry.target);
    }
  });
},{threshold:0.1});

// Observe cards dynamically after they are loaded
function observeCards(){
  document.querySelectorAll('.watch-card').forEach(card=>{
    card.classList.add('fade-up');
    observer.observe(card);
  });
}
