// Sidebar toggle
const menuToggle = document.getElementById('menu-toggle');
const sidebar = document.getElementById('sidebar');

menuToggle.addEventListener('click', () => {
sidebar.classList.toggle('active');
menuToggle.classList.toggle('open');
});

// Optional: transform hamburger to cross
menuToggle.addEventListener('click', () => {
menuToggle.classList.toggle('cross');
});
