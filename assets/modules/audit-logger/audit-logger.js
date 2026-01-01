/**
 * audit-logger.js
 * Tracks user actions and logs them for administrative review.
 */

(function() {
    const LOG_KEY = 'app_audit_logs';
    const MAX_LOGS = 100;

    function logAction(action, details = {}) {
        const log = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            action: action,
            details: details,
            url: window.location.pathname,
            user: localStorage.getItem('userName') || 'Guest'
        };

        // Get existing logs
        let logs = JSON.parse(localStorage.getItem(LOG_KEY) || '[]');
        
        // Add new log
        logs.unshift(log); // Add to beginning
        
        // Prune old logs
        if (logs.length > MAX_LOGS) {
            logs = logs.slice(0, MAX_LOGS);
        }

        // Save
        localStorage.setItem(LOG_KEY, JSON.stringify(logs));
        
        // Console debug (optional)
        console.log(`📝 [Audit] ${action}:`, details);
    }

    // Auto-track button clicks
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('button, a.btn');
        if (btn) {
            const label = btn.innerText || btn.title || btn.id || 'Unknown Button';
            logAction('CLICK_BUTTON', { label: label.trim() });
        }
    });

    // Track Navigation
    logAction('PAGE_VIEW', { title: document.title });

    // Expose logger globally
    window.auditLog = logAction;
})();
