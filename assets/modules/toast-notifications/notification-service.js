/**
 * notification-service.js
 * Provides a professional toast notification system.
 * Optionally intercepts window.alert() calls.
 */

(function() {
    // Create container
    const container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);

    window.showToast = function(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `custom-toast toast-${type}`;
        
        let icon = 'info-circle';
        if (type === 'success') icon = 'check-circle';
        if (type === 'error') icon = 'exclamation-circle';
        if (type === 'warning') icon = 'exclamation-triangle';
        if (type === 'wallet') icon = 'wallet';

        toast.innerHTML = `
            <i class="fas fa-${icon}"></i>
            <span>${message}</span>
        `;

        container.appendChild(toast);

        // Animate in
        requestAnimationFrame(() => {
            toast.classList.add('show');
        });

        // Remove after duration
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 300); // Wait for transition
        }, duration);
    };

    // OPTIONAL: Override standard alert
    // Uncomment the next line to replace ALL browser alerts with nice toasts
    // window.alert = (msg) => window.showToast(msg, 'info');

    console.log('🔔 Notification Service Ready. Use showToast("Msg", "type")');
})();
