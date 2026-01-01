/**
 * theme-manager.js
 * Handles Dark/Light mode toggling and persistence.
 */

(function() {
    const THEME_KEY = 'app_theme_preference';
    
    // Create and inject the toggle button
    function createToggleButton() {
        const btn = document.createElement('button');
        btn.id = 'theme-toggle-btn';
        btn.innerHTML = '<i class="fas fa-moon"></i>';
        btn.title = 'Toggle Dark Mode';
        btn.setAttribute('aria-label', 'Toggle Dark Mode');
        document.body.appendChild(btn);

        btn.addEventListener('click', toggleTheme);
    }

    function applyTheme(theme) {
        const root = document.documentElement;
        const btn = document.getElementById('theme-toggle-btn');
        
        if (theme === 'dark') {
            root.setAttribute('data-theme', 'dark');
            if (btn) btn.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            root.removeAttribute('data-theme');
            if (btn) btn.innerHTML = '<i class="fas fa-moon"></i>';
        }
        
        localStorage.setItem(THEME_KEY, theme);
    }

    function toggleTheme() {
        const current = localStorage.getItem(THEME_KEY);
        const newTheme = current === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
    }

    function init() {
        // Load preference
        const savedTheme = localStorage.getItem(THEME_KEY) || 'light';
        createToggleButton();
        applyTheme(savedTheme);
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
