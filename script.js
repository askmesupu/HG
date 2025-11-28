const sidebarToggle = document.querySelector('.sidebar-toggle');
const sidebar = document.getElementById('sidebar');

// Initially hide sidebar
sidebar.style.left = '-250px';

sidebarToggle.addEventListener('click', () => {
    if (sidebar.style.left === '-250px') {
        sidebar.style.left = '0';
        sidebarToggle.textContent = '✖'; // Change to cross
    } else {
        sidebar.style.left = '-250px';
        sidebarToggle.textContent = '☰'; // Change back to three lines
    }
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
