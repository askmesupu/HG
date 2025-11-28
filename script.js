const sidebarToggle = document.querySelector('.sidebar-toggle');
const sidebar = document.getElementById('sidebar');

sidebarToggle.addEventListener('click', () => {
    sidebar.classList.toggle('active');
    sidebarToggle.textContent = sidebar.classList.contains('active') ? '✖' : '☰';
});

// Scroll animation for watch cards
window.addEventListener('scroll', () => {
    const cards = document.querySelectorAll('.watch-card');
    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        if(rect.top < window.innerHeight - 50) {
            card.style.transform = 'translateY(0)';
            card.style.opacity = '1';
            card.style.transition = 'all 0.5s ease-in';
        }
    });
});
