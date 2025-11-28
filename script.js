const sidebarToggle = document.querySelector('.sidebar-toggle');
const sidebar = document.getElementById('sidebar');

sidebarToggle.addEventListener('click', () => {
if (sidebar.style.left === '-250px') {
sidebar.style.left = '0';
sidebarToggle.textContent = '✖';
} else {
sidebar.style.left = '-250px';
sidebarToggle.textContent = '☰';
}
});
