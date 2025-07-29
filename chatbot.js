// Redirect to login if not logged in
if (!localStorage.getItem("username")) {
  location.href = "login.html";
}

const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');
const API_KEY = 'AIzaSyAr0RiT4gA2muZuZkj85eT-_cG6cUELaxU';
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';

function cleanMarkdown(text) {
  return text
    .replace(/#{1,6}\s?/g, '')
    .replace(/\*\*/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function addMessage(message, isUser) {
  const messageElement = document.createElement('div');
  messageElement.classList.add('message', isUser ? 'user-message' : 'bot-message');

  const messageContent = document.createElement('div');
  messageContent.classList.add('message-content');
  messageContent.textContent = message;

  messageElement.appendChild(messageContent);
  chatMessages.appendChild(messageElement);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function generateResponse(prompt) {
  const response = await fetch(`${API_URL}?key=${API_KEY}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: prompt }]
        }
      ]
    })
  });

  if (!response.ok) throw new Error('API Error');
  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}

async function handleUserInput() {
  const userMessage = userInput.value.trim();
  if (userMessage) {
    addMessage(userMessage, true);
    userInput.value = '';
    sendButton.disabled = true;
    userInput.disabled = true;

    try {
      const botMessage = await generateResponse(userMessage);
      const cleanBot = cleanMarkdown(botMessage);
      addMessage(cleanBot, false);

      // Save to localStorage as history
      let history = JSON.parse(localStorage.getItem("history") || "[]");
      history.push({ user: userMessage, bot: cleanBot });
      localStorage.setItem("history", JSON.stringify(history));

    } catch (error) {
      console.error('Error:', error);
      addMessage("Sorry, something went wrong.", false);
    } finally {
      sendButton.disabled = false;
      userInput.disabled = false;
      userInput.focus();
    }
  }
}

sendButton.addEventListener('click', handleUserInput);
userInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    handleUserInput();
  }
});