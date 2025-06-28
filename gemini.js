        const API_KEY = "AIzaSyAvOP5TbUr0sYs4o_w23ugDxImPQpZSaRo";
        const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

        // DOM elements
        const chatMessages = document.getElementById('chat-messages');
        const userInput = document.getElementById('user-input');
        const sendButton = document.getElementById('send-button');
        const darkModeToggle = document.getElementById('dark-mode-toggle');
        const typingIndicator = document.getElementById('typing-indicator');

        // Check for saved theme preference
        if (localStorage.getItem('darkMode') === 'enabled') {
            document.body.classList.add('dark-mode');
            darkModeToggle.checked = true;
        }

        // Dark mode toggle
        darkModeToggle.addEventListener('change', () => {
            document.body.classList.toggle('dark-mode');
            if (document.body.classList.contains('dark-mode')) {
                localStorage.setItem('darkMode', 'enabled');
            } else {
                localStorage.setItem('darkMode', 'disabled');
            }
        });

        // Send message when button is clicked or Enter is pressed
        sendButton.addEventListener('click', sendMessage);
        userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });

        async function sendMessage() {
            const message = userInput.value.trim();
            if (!message) return;

            // Add user message to chat
            addMessage(message, 'user');
            userInput.value = '';
            
            // Show typing indicator
            typingIndicator.style.display = 'block';
            chatMessages.scrollTop = chatMessages.scrollHeight;

            try {
                const response = await fetch(API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        contents: [{
                            parts: [{
                                text: message
                            }]
                        }]
                    })
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                const botResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "I couldn't generate a response. Please try again.";

                // Hide typing indicator and add bot response
                typingIndicator.style.display = 'none';
                addMessage(botResponse, 'bot');
            } catch (error) {
                console.error('Error:', error);
                typingIndicator.style.display = 'none';
                addMessage("Sorry, I encountered an error. Please try again later.", 'bot');
            }
        }

        function addMessage(text, sender) {
            const messageDiv = document.createElement('div');
            messageDiv.classList.add('message', `${sender}-message`);
            messageDiv.textContent = text;
            chatMessages.appendChild(messageDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }