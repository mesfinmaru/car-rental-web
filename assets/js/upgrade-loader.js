/**
 * upgrade-loader.js
 * 
 * This script serves as the single entry point for all professional upgrades.
 * It dynamically loads the CSS and JS for the independent modules so that
 * the existing HTML files only need one additional script tag.
 */

(function() {
    console.log('🚀 Professional Upgrades Loading...');

    const BASE_PATH = 'assets/modules';

    // List of modules to load
    const modules = [
        {
            name: 'theme-toggle',
            css: `${BASE_PATH}/theme-toggle/theme-toggle.css`,
            js: `${BASE_PATH}/theme-toggle/theme-manager.js`
        },
        {
            name: 'toast-notifications',
            css: `${BASE_PATH}/toast-notifications/toast.css`,
            js: `${BASE_PATH}/toast-notifications/notification-service.js`
        },
        {
            name: 'audit-logger',
            js: `${BASE_PATH}/audit-logger/audit-logger.js`
        }
    ];

    // Helper to load CSS
    function loadCSS(href) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        document.head.appendChild(link);
    }

    // Helper to load JS
    function loadJS(src) {
        const script = document.createElement('script');
        script.src = src;
        script.defer = true;
        document.body.appendChild(script);
    }

    // Initialize Modules
    modules.forEach(mod => {
        if (mod.css) loadCSS(mod.css);
        if (mod.js) loadJS(mod.js);
    });

    console.log('✅ Upgrade Loader finished injecting modules.');
})();
