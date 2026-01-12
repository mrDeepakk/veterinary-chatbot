(function () {
    'use strict';

    // Configuration
    const WIDGET_SCRIPT_URL = window.VET_CHATBOT_WIDGET_URL || 'http://localhost:3000/widget.js';
    const API_BASE_URL = window.VET_CHATBOT_API_URL || 'http://localhost:3000';

    // Generate or retrieve session ID
    function getSessionId() {
        const STORAGE_KEY = 'vet_chatbot_session_id';

        try {
            let sessionId = localStorage.getItem(STORAGE_KEY);

            if (!sessionId) {
                // Generate new UUID v4
                sessionId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                    const r = (Math.random() * 16) | 0;
                    const v = c === 'x' ? r : (r & 0x3) | 0x8;
                    return v.toString(16);
                });

                localStorage.setItem(STORAGE_KEY, sessionId);
            }

            return sessionId;
        } catch (error) {
            // Fallback if localStorage is not available
            console.warn('localStorage not available, using temporary session');
            return 'temp-' + Date.now();
        }
    }

    // Read configuration from window
    function getConfig() {
        return window.VetChatbotConfig || {};
    }

    // Create container div for widget
    function createContainer() {
        const container = document.createElement('div');
        container.id = 'vet-chatbot-container';
        container.style.position = 'fixed';
        container.style.zIndex = '999999';
        document.body.appendChild(container);
        return container;
    }

    // Load widget script
    function loadWidget(sessionId, config) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = WIDGET_SCRIPT_URL;
            script.async = true;

            script.onload = () => {
                console.log('✅ Vet Chatbot widget loaded successfully');
                resolve();
            };

            script.onerror = () => {
                console.error('❌ Failed to load Vet Chatbot widget');
                reject(new Error('Failed to load widget script'));
            };

            document.head.appendChild(script);
        });
    }

    // Initialize the chatbot
    async function initChatbot() {
        try {
            console.log('🐾 Initializing Veterinary Chatbot...');

            // Get session ID and config
            const sessionId = getSessionId();
            const config = getConfig();

            console.log('Session ID:', sessionId);
            console.log('Config:', config);

            // Create container
            const container = createContainer();

            // Load widget script
            await loadWidget(sessionId, config);

            // Initialize widget (handle both direct and default exports)
            const widgetInit = window.VetChatWidget?.init || window.VetChatWidget?.default?.init;

            if (typeof widgetInit === 'function') {
                widgetInit('vet-chatbot-container', sessionId, config);
                console.log('✅ Veterinary Chatbot initialized successfully');
            } else {
                throw new Error('Widget initialization function not found');
            }
        } catch (error) {
            console.error('Chatbot initialization error:', error);
        }
    }

    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initChatbot);
    } else {
        initChatbot();
    }

    // Expose API for manual control (optional)
    window.VetChatbot = {
        sessionId: getSessionId(),
        config: getConfig(),
    };
})();
