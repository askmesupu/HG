const menuToggle = document.getElementById('menu-toggle');
const sidebar = document.getElementById('sidebar');
const closeSidebar = document.getElementById('close-sidebar');

menuToggle.addEventListener('click', ()=>{
  sidebar.classList.add('show');
});

closeSidebar.addEventListener('click', ()=>{
  sidebar.classList.remove('show');
});
