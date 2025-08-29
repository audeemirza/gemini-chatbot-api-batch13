const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');

/**
 * Appends a new message to the chat box.
 * @param {string} sender - The sender of the message ('user' or 'bot').
 * @param {string} text - The text content of the message.
 * @returns {HTMLElement} The created message element.
 */
function appendMessage(sender, text) {
  const msg = document.createElement('div');
  msg.classList.add('message', sender);
  msg.textContent = text;
  chatBox.appendChild(msg);
  // Scroll to the bottom of the chat box to show the latest message
  chatBox.scrollTop = chatBox.scrollHeight;
  return msg;
}

/**
 * Handles the form submission event.
 * @param {Event} e - The form submission event.
 */
async function handleFormSubmit(e) {
  e.preventDefault();

  const userMessage = input.value.trim();
  if (!userMessage) return;

  // Display user's message and clear the input
  appendMessage('user', userMessage);
  input.value = '';

  // Add a placeholder for the bot's response and keep a reference to it
  const botMessageElement = appendMessage('bot', 'Gemini is thinking...');

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // Construct the request body as per the backend API spec
      body: JSON.stringify({
        messages: [{ role: 'user', content: userMessage }],
      }),
    });

    if (!response.ok) {
      // Handle HTTP errors (e.g., 404, 500)
      throw new Error('Server responded with an error.');
    }

    const data = await response.json();

    // Update the bot's message with the response from the server
    if (data && data.result) {
      botMessageElement.textContent = data.result;
    } else {
      // Handle cases where the response is OK but doesn't contain the expected data
      botMessageElement.textContent = 'Sorry, no response received.';
    }
  } catch (error) {
    // Handle network errors or other exceptions during fetch
    console.error('Error fetching chat response:', error);
    botMessageElement.textContent = 'Failed to get response from server.';
  }
}

form.addEventListener('submit', handleFormSubmit);
