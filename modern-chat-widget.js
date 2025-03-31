// Modern Chat Widget Script
(function() {
    // Create and inject styles
    const styles = `
        .n8n-chat-widget {
            --chat--color-primary: var(--n8n-chat-primary-color, #854fff);
            --chat--color-secondary: var(--n8n-chat-secondary-color, #6b3fd4);
            --chat--color-background: var(--n8n-chat-background-color, #ffffff);
            --chat--color-font: var(--n8n-chat-font-color, #333333);
            --chat--shadow-color: rgba(var(--n8n-chat-primary-color-rgb, 133, 79, 255), 0.15);
            --chat--border-color: rgba(var(--n8n-chat-primary-color-rgb, 133, 79, 255), 0.2);
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        }

        .n8n-chat-widget .chat-container {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 1000;
            display: none;
            width: 90vw;
            min-width: 380px;
            max-width: 95vw;
            height: 90vh;
            min-height: 600px;
            background: var(--chat--color-background);
            border-radius: 16px;
            box-shadow: 0 12px 40px var(--chat--shadow-color);
            border: 1px solid var(--chat--border-color);
            overflow: hidden;
            font-family: inherit;
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .n8n-chat-widget .chat-container.position-left {
            right: auto;
            left: 20px;
        }

        .n8n-chat-widget .chat-container.open {
            display: flex;
            flex-direction: column;
            animation: chat-container-open 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        
        @keyframes chat-container-open {
            0% { opacity: 0; transform: translateY(10px); }
            100% { opacity: 1; transform: translateY(0); }
        }

        .n8n-chat-widget .brand-header {
            padding: 16px 20px;
            display: flex;
            align-items: center;
            gap: 12px;
            border-bottom: 1px solid var(--chat--border-color);
            position: relative;
            background: var(--chat--color-background);
        }

        .n8n-chat-widget .close-button {
            position: absolute;
            right: 16px;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            color: var(--chat--color-font);
            cursor: pointer;
            padding: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
            font-size: 24px;
            opacity: 0.6;
            border-radius: 50%;
        }

        .n8n-chat-widget .close-button:hover {
            opacity: 1;
            background: rgba(0, 0, 0, 0.05);
        }

        .n8n-chat-widget .brand-header img {
            width: 36px;
            height: 36px;
            border-radius: 8px;
            object-fit: contain;
        }

        .n8n-chat-widget .brand-header span {
            font-size: 18px;
            font-weight: 600;
            color: var(--chat--color-font);
        }

        .n8n-chat-widget .new-conversation {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            padding: 30px;
            text-align: center;
            width: 100%;
            max-width: 400px;
        }

        .n8n-chat-widget .welcome-text {
            font-size: 28px;
            font-weight: 700;
            color: var(--chat--color-font);
            margin-bottom: 24px;
            line-height: 1.3;
        }

        .n8n-chat-widget .new-chat-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            width: 100%;
            padding: 16px 24px;
            background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
            color: white;
            border: none;
            border-radius: 12px;
            cursor: pointer;
            font-size: 16px;
            transition: all 0.3s;
            font-weight: 600;
            font-family: inherit;
            margin-bottom: 16px;
            box-shadow: 0 4px 12px rgba(var(--n8n-chat-primary-color-rgb, 133, 79, 255), 0.3);
        }

        .n8n-chat-widget .new-chat-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(var(--n8n-chat-primary-color-rgb, 133, 79, 255), 0.4);
        }

        .n8n-chat-widget .message-icon {
            width: 20px;
            height: 20px;
        }

        .n8n-chat-widget .response-text {
            font-size: 15px;
            color: var(--chat--color-font);
            opacity: 0.7;
            margin: 0;
        }

        .n8n-chat-widget .chat-interface {
            display: none;
            flex-direction: column;
            height: 100%;
        }

        .n8n-chat-widget .chat-interface.active {
            display: flex;
        }

        .n8n-chat-widget .chat-messages {
            flex: 1;
            overflow-y: auto;
            padding: 24px;
            background: var(--chat--color-background);
            display: flex;
            flex-direction: column;
            scroll-behavior: smooth;
        }

        .n8n-chat-widget .chat-message {
            padding: 14px 18px;
            margin: 8px 0;
            border-radius: 16px;
            max-width: 85%;
            word-wrap: break-word;
            font-size: 15px;
            line-height: 1.5;
            transition: all 0.2s;
            animation: message-appear 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            opacity: 0;
        }
        
        @keyframes message-appear {
            0% { opacity: 0; transform: translateY(10px); }
            100% { opacity: 1; transform: translateY(0); }
        }

        .n8n-chat-widget .chat-message.user {
            background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
            color: white;
            align-self: flex-end;
            border-bottom-right-radius: 4px;
            box-shadow: 0 4px 12px rgba(var(--n8n-chat-primary-color-rgb, 133, 79, 255), 0.2);
            border: none;
        }

        .n8n-chat-widget .chat-message.bot {
            background: var(--chat--color-background);
            border: 1px solid var(--chat--border-color);
            color: var(--chat--color-font);
            align-self: flex-start;
            border-bottom-left-radius: 4px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }
        
        /* Message formatting styles */
        .n8n-chat-widget .chat-message.bot p {
            margin: 0 0 12px 0;
        }
        
        .n8n-chat-widget .chat-message.bot p:last-child {
            margin-bottom: 0;
        }
        
        .n8n-chat-widget .chat-message.bot ul, 
        .n8n-chat-widget .chat-message.bot ol {
            margin: 10px 0;
            padding-left: 20px;
        }
        
        .n8n-chat-widget .chat-message.bot li {
            margin-bottom: 6px;
        }
        
        .n8n-chat-widget .chat-message.bot li:last-child {
            margin-bottom: 0;
        }
        
        .n8n-chat-widget .chat-message.bot strong {
            font-weight: 600;
        }
        
        .n8n-chat-widget .chat-message.bot em {
            font-style: italic;
        }
        
        .n8n-chat-widget .chat-message.bot a {
            color: var(--chat--color-primary);
            text-decoration: underline;
            transition: opacity 0.2s;
        }
        
        .n8n-chat-widget .chat-message.bot a:hover {
            opacity: 0.8;
        }
        
        .n8n-chat-widget .chat-message.bot pre {
            background-color: rgba(0, 0, 0, 0.05);
            padding: 12px;
            border-radius: 8px;
            overflow-x: auto;
            margin: 12px 0;
            font-family: 'JetBrains Mono', monospace;
            font-size: 14px;
        }
        
        .n8n-chat-widget .chat-message.bot code {
            background-color: rgba(0, 0, 0, 0.05);
            padding: 2px 5px;
            border-radius: 4px;
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.9em;
        }

        .n8n-chat-widget .chat-input {
            padding: 16px 20px;
            background: var(--chat--color-background);
            border-top: 1px solid var(--chat--border-color);
            display: flex;
            gap: 12px;
        }

        .n8n-chat-widget .chat-input textarea {
            flex: 1;
            padding: 14px;
            border: 1px solid var(--chat--border-color);
            border-radius: 12px;
            background: var(--chat--color-background);
            color: var(--chat--color-font);
            resize: none;
            font-family: inherit;
            font-size: 15px;
            transition: all 0.2s;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
            min-height: 24px;
            max-height: 120px;
        }

        .n8n-chat-widget .chat-input textarea:focus {
            outline: none;
            border-color: var(--chat--color-primary);
            box-shadow: 0 2px 8px rgba(var(--n8n-chat-primary-color-rgb, 133, 79, 255), 0.2);
        }

        .n8n-chat-widget .chat-input textarea::placeholder {
            color: var(--chat--color-font);
            opacity: 0.5;
        }

        .n8n-chat-widget .chat-input button {
            background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
            color: white;
            border: none;
            border-radius: 12px;
            padding: 0 20px;
            cursor: pointer;
            transition: all 0.2s;
            font-family: inherit;
            font-weight: 600;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 8px rgba(var(--n8n-chat-primary-color-rgb, 133, 79, 255), 0.2);
        }

        .n8n-chat-widget .chat-input button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 12px rgba(var(--n8n-chat-primary-color-rgb, 133, 79, 255), 0.3);
        }
        
        .n8n-chat-widget .chat-input button svg {
            width: 20px;
            height: 20px;
        }

        .n8n-chat-widget .chat-toggle {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 64px;
            height: 64px;
            border-radius: 32px;
            background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
            color: white;
            border: none;
            cursor: pointer;
            box-shadow: 0 6px 16px rgba(var(--n8n-chat-primary-color-rgb, 133, 79, 255), 0.4);
            z-index: 999;
            transition: all 0.3s;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .n8n-chat-widget .chat-toggle.position-left {
            right: auto;
            left: 20px;
        }

        .n8n-chat-widget .chat-toggle:hover {
            transform: translateY(-4px) scale(1.05);
            box-shadow: 0 8px 24px rgba(var(--n8n-chat-primary-color-rgb, 133, 79, 255), 0.5);
        }

        .n8n-chat-widget .chat-toggle svg {
            width: 28px;
            height: 28px;
            fill: currentColor;
        }

        .n8n-chat-widget .chat-footer {
            padding: 10px;
            text-align: center;
            background: var(--chat--color-background);
            border-top: 1px solid var(--chat--border-color);
        }

        .n8n-chat-widget .chat-footer a {
            color: var(--chat--color-primary);
            text-decoration: none;
            font-size: 13px;
            opacity: 0.7;
            transition: opacity 0.2s;
            font-family: inherit;
        }

        .n8n-chat-widget .chat-footer a:hover {
            opacity: 1;
        }
        
        /* Typing indicator */
        .n8n-chat-widget .typing-indicator {
            display: none;
            align-self: flex-start;
            background: rgba(var(--n8n-chat-primary-color-rgb, 133, 79, 255), 0.1);
            padding: 12px 16px;
            border-radius: 16px;
            border-bottom-left-radius: 4px;
            margin-top: 8px;
        }
        
        .n8n-chat-widget .typing-indicator.active {
            display: flex;
        }
        
        .n8n-chat-widget .typing-indicator span {
            width: 8px;
            height: 8px;
            background: var(--chat--color-primary);
            border-radius: 50%;
            display: inline-block;
            margin: 0 2px;
            opacity: 0.6;
        }
        
        .n8n-chat-widget .typing-indicator span:nth-child(1) {
            animation: typing 1s infinite 0s;
        }
        
        .n8n-chat-widget .typing-indicator span:nth-child(2) {
            animation: typing 1s infinite 0.2s;
        }
        
        .n8n-chat-widget .typing-indicator span:nth-child(3) {
            animation: typing 1s infinite 0.4s;
        }
        
        @keyframes typing {
            0% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
            100% { transform: translateY(0); }
        }
        
        /* Responsive adjustments */
        @media (max-width: 768px) {
            .n8n-chat-widget .chat-container {
                width: 95vw;
                height: 90vh;
                min-width: 300px;
                bottom: 10px;
                right: 10px;
            }
            
            .n8n-chat-widget .chat-container.position-left {
                left: 10px;
            }
            
            .n8n-chat-widget .chat-toggle {
                width: 56px;
                height: 56px;
                bottom: 15px;
                right: 15px;
            }
            
            .n8n-chat-widget .chat-toggle.position-left {
                left: 15px;
            }
            
            .n8n-chat-widget .chat-message {
                max-width: 90%;
            }
            
            .n8n-chat-widget .welcome-text {
                font-size: 24px;
            }
        }
        
        @media (max-width: 480px) {
            .n8n-chat-widget .chat-container {
                width: 100vw;
                height: 100vh;
                max-width: 100vw;
                bottom: 0;
                right: 0;
                border-radius: 0;
            }
            
            .n8n-chat-widget .chat-container.position-left {
                left: 0;
            }
            
            .n8n-chat-widget .welcome-text {
                font-size: 22px;
            }
            
            .n8n-chat-widget .new-conversation {
                max-width: 90%;
            }
        }
    `;

    // Load Inter font
    const fontLink = document.createElement('link');
    fontLink.rel = 'stylesheet';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono&display=swap';
    document.head.appendChild(fontLink);

    // Inject styles
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    // Default configuration
    const defaultConfig = {
        webhook: {
            url: '',
            route: ''
        },
        branding: {
            logo: '',
            name: '',
            welcomeText: '',
            responseTimeText: '',
            poweredBy: {
                text: 'Powered by n8n',
                link: 'https://n8n.partnerlinks.io/m8a94i19zhqq?utm_source=nocodecreative.io'
            }
        },
        style: {
            primaryColor: '',
            primaryColorRgb: '133, 79, 255', // Default RGB values
            secondaryColor: '',
            position: 'right',
            backgroundColor: '#ffffff',
            fontColor: '#333333'
        }
    };

    // Helper function to convert hex to RGB
    function hexToRgb(hex) {
        // Remove # if present
        hex = hex.replace('#', '');
        
        // Parse hex values
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        
        // Return RGB string
        return `${r}, ${g}, ${b}`;
    }

    // Merge user config with defaults
    const config = window.ChatWidgetConfig ? 
        {
            webhook: { ...defaultConfig.webhook, ...window.ChatWidgetConfig.webhook },
            branding: { ...defaultConfig.branding, ...window.ChatWidgetConfig.branding },
            style: { ...defaultConfig.style, ...window.ChatWidgetConfig.style }
        } : defaultConfig;
    
    // Calculate RGB values for primary color if provided
    if (config.style.primaryColor && config.style.primaryColor.startsWith('#')) {
        config.style.primaryColorRgb = hexToRgb(config.style.primaryColor);
    }

    // Prevent multiple initializations
    if (window.N8NChatWidgetInitialized) return;
    window.N8NChatWidgetInitialized = true;

    let currentSessionId = '';
    let isWaitingForResponse = false;

    // Create widget container
    const widgetContainer = document.createElement('div');
    widgetContainer.className = 'n8n-chat-widget';
    
    // Set CSS variables for colors
    widgetContainer.style.setProperty('--n8n-chat-primary-color', config.style.primaryColor);
    widgetContainer.style.setProperty('--n8n-chat-primary-color-rgb', config.style.primaryColorRgb);
    widgetContainer.style.setProperty('--n8n-chat-secondary-color', config.style.secondaryColor);
    widgetContainer.style.setProperty('--n8n-chat-background-color', config.style.backgroundColor);
    widgetContainer.style.setProperty('--n8n-chat-font-color', config.style.fontColor);

    const chatContainer = document.createElement('div');
    chatContainer.className = `chat-container${config.style.position === 'left' ? ' position-left' : ''}`;
    
    const newConversationHTML = `
        <div class="brand-header">
            <img src="${config.branding.logo}" alt="${config.branding.name}">
            <span>${config.branding.name}</span>
            <button class="close-button" aria-label="Close chat">×</button>
        </div>
        <div class="new-conversation">
            <h2 class="welcome-text">${config.branding.welcomeText}</h2>
            <button class="new-chat-btn">
                <svg class="message-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.2L4 17.2V4h16v12z"/>
                </svg>
                Send us a message
            </button>
            <p class="response-text">${config.branding.responseTimeText}</p>
        </div>
    `;

    const chatInterfaceHTML = `
        <div class="chat-interface">
            <div class="brand-header">
                <img src="${config.branding.logo}" alt="${config.branding.name}">
                <span>${config.branding.name}</span>
                <button class="close-button" aria-label="Close chat">×</button>
            </div>
            <div class="chat-messages"></div>
            <div class="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
            </div>
            <div class="chat-input">
                <textarea placeholder="Type your message here..." rows="1" aria-label="Message input"></textarea>
                <button type="submit" aria-label="Send message">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="22" y1="2" x2="11" y2="13"></line>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                </button>
            </div>
            <div class="chat-footer">
                <a href="${config.branding.poweredBy.link}" target="_blank" rel="noopener noreferrer">${config.branding.poweredBy.text}</a>
            </div>
        </div>
    `;
    
    chatContainer.innerHTML = newConversationHTML + chatInterfaceHTML;
    
    const toggleButton = document.createElement('button');
    toggleButton.className = `chat-toggle${config.style.position === 'left' ? ' position-left' : ''}`;
    toggleButton.setAttribute('aria-label', 'Open chat');
    toggleButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
        </svg>`;
    
    widgetContainer.appendChild(chatContainer);
    widgetContainer.appendChild(toggleButton);
    document.body.appendChild(widgetContainer);

    const newChatBtn = chatContainer.querySelector('.new-chat-btn');
    const chatInterface = chatContainer.querySelector('.chat-interface');
    const messagesContainer = chatContainer.querySelector('.chat-messages');
    const typingIndicator = chatContainer.querySelector('.typing-indicator');
    const textarea = chatContainer.querySelector('textarea');
    const sendButton = chatContainer.querySelector('button[type="submit"]');

    function generateUUID() {
        return crypto.randomUUID();
    }

    // Simple Markdown-like formatting parser
    function formatMessage(text) {
        if (!text) return '';
        
        // Convert line breaks to paragraphs
        let formatted = '<p>' + text.replace(/\n\n+/g, '</p><p>').replace(/\n/g, '<br>') + '</p>';
        
        // Bold text
        formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        // Italic text
        formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');
        
        // Links
        formatted = formatted.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
        
        // Bullet lists
        formatted = formatted.replace(/(<p>)?- (.*?)(<\/p>|$)/g, function(match, p1, content, p3) {
            return (p1 ? '<ul>' : '') + '<li>' + content + '</li>' + (p3 ? '</ul>' : '');
        });
        
        // Fix broken lists
        formatted = formatted.replace(/<\/ul><ul>/g, '');
        
        // Add missing closing tags
        if (formatted.includes('<ul>') && !formatted.includes('</ul>')) {
            formatted += '</ul>';
        }
        
        // Code blocks
        formatted = formatted.replace(/```([^`]+)```/g, '<pre><code>$1</code></pre>');
        
        // Inline code
        formatted = formatted.replace(/`([^`]+)`/g, '<code>$1</code>');
        
        return formatted;
    }

    async function startNewConversation() {
        currentSessionId = generateUUID();
        const data = [{
            action: "loadPreviousSession",
            sessionId: currentSessionId,
            route: config.webhook.route,
            metadata: {
                userId: ""
            }
        }];

        try {
            chatContainer.querySelector('.brand-header').style.display = 'none';
            chatContainer.querySelector('.new-conversation').style.display = 'none';
            chatInterface.classList.add('active');
            
            // Show typing indicator
            typingIndicator.classList.add('active');
            
            const response = await fetch(config.webhook.url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            // Hide typing indicator
            typingIndicator.classList.remove('active');

            const responseData = await response.json();
            
            const botMessageDiv = document.createElement('div');
            botMessageDiv.className = 'chat-message bot';
            const responseText = Array.isArray(responseData) ? responseData[0].output : responseData.output;
            botMessageDiv.innerHTML = formatMessage(responseText);
            messagesContainer.appendChild(botMessageDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        } catch (error) {
            console.error('Error:', error);
            
            // Hide typing indicator and show error message
            typingIndicator.classList.remove('active');
            
            const errorMessageDiv = document.createElement('div');
            errorMessageDiv.className = 'chat-message bot';
            errorMessageDiv.innerHTML = formatMessage("I'm sorry, there was an error connecting to the service. Please try again later.");
            messagesContainer.appendChild(errorMessageDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }

    async function sendMessage(message) {
        if (isWaitingForResponse) return;
        
        isWaitingForResponse = true;
        
        const messageData = {
            action: "sendMessage",
            sessionId: currentSessionId,
            route: config.webhook.route,
            chatInput: message,
            metadata: {
                userId: ""
            }
        };

        const userMessageDiv = document.createElement('div');
        userMessageDiv.className = 'chat-message user';
        userMessageDiv.textContent = message;
        messagesContainer.appendChild(userMessageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // Show typing indicator
        typingIndicator.classList.add('active');
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        try {
            const response = await fetch(config.webhook.url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(messageData)
            });
            
            const data = await response.json();
            
            // Hide typing indicator
            typingIndicator.classList.remove('active');
            
            const botMessageDiv = document.createElement('div');
            botMessageDiv.className = 'chat-message bot';
            const responseText = Array.isArray(data) ? data[0].output : data.output;
            botMessageDiv.innerHTML = formatMessage(responseText);
            messagesContainer.appendChild(botMessageDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        } catch (error) {
            console.error('Error:', error);
            
            // Hide typing indicator and show error message
            typingIndicator.classList.remove('active');
            
            const errorMessageDiv = document.createElement('div');
            errorMessageDiv.className = 'chat-message bot';
            errorMessageDiv.innerHTML = formatMessage("I'm sorry, there was an error connecting to the service. Please try again later.");
            messagesContainer.appendChild(errorMessageDiv);
        } finally {
            isWaitingForResponse = false;
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        })();
