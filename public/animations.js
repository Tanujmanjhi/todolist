document.addEventListener('DOMContentLoaded', () => {
    // Add 'new' class to newly added todos
    const todoItems = document.querySelectorAll('.todo-item');
    todoItems.forEach(item => {
        if (!item.classList.contains('animated')) {
            item.classList.add('new', 'animated');
        }
    });

    // Improved toggle animation handling
    document.addEventListener('click', function(e) {
        const checkbox = e.target.closest('.todo-checkbox');
        if (checkbox) {
            const todoItem = checkbox.closest('.todo-item');
            if (todoItem) {
                // Remove any existing animation classes
                todoItem.classList.remove('completing', 'fade-out', 'fade-in');
                
                // Force a reflow to restart animation
                void todoItem.offsetWidth;
                
                // Add animation classes
                todoItem.classList.add('completing');
                if (checkbox.checked) {
                    todoItem.classList.add('fade-out');
                } else {
                    todoItem.classList.add('fade-in');
                }
                
                // Clean up animation classes after animation completes
                setTimeout(() => {
                    todoItem.classList.remove('completing', 'fade-out', 'fade-in');
                }, 500);
            }
        }
    });

    // Add ripple effect to buttons
    document.querySelectorAll('.ripple').forEach(button => {
        button.addEventListener('click', function(e) {
            const x = e.clientX - e.target.offsetLeft;
            const y = e.clientY - e.target.offsetTop;

            const ripples = document.createElement('span');
            ripples.style.left = x + 'px';
            ripples.style.top = y + 'px';
            ripples.classList.add('ripple-effect');

            this.appendChild(ripples);

            setTimeout(() => {
                ripples.remove();
            }, 1000);
        });
    });

    // Animate todo items on scroll
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);

    todoItems.forEach(item => {
        observer.observe(item);
    });
});