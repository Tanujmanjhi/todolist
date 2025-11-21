document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('themeSwitch');
    const body = document.body;

    // Load previous mode
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark');
    }

    // Icon update
    const updateIcon = () => {
        btn.textContent = body.classList.contains('dark') ? '☀️' : '🌙';
    }
    updateIcon();

    // Toggle
    btn.addEventListener('click', () => {
        body.classList.toggle('dark');
        localStorage.setItem('theme',
            body.classList.contains('dark') ? 'dark' : 'light'
        );
        updateIcon();
    });
});
