// public/script.js
document.addEventListener('DOMContentLoaded', function () {
  loadMessages();
});

function postMessage() {
  var messageInput = document.getElementById('message-input');

  // Trim the message and check its length
  var trimmedMessage = messageInput.value.trim();

  if (trimmedMessage !== '' && trimmedMessage.length <= 128) {
    var message = {
      text: trimmedMessage,
      timestamp: new Date().toLocaleString(),
    };

    fetch('/api/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    })
      .then(response => response.text())
      .then(responseMessage => {
        console.log(responseMessage);
        loadMessages(); // Reload messages after posting
      });

    // Clear the input field
    messageInput.value = '';
  } else {
    alert('Message should not be empty and should not exceed 128 characters.');
  }
}


function loadMessages() {
  var messagesContainer = document.getElementById('messages-container');

  fetch('/api/messages')
    .then(response => response.json())
    .then(messages => {
      // Clear existing messages
      messagesContainer.innerHTML = '';

      messages.forEach(message => {
        // Create a message container div
        var messageDiv = document.createElement('div');
        messageDiv.className = 'message';
        
        // Create a paragraph for the message content
        var contentParagraph = document.createElement('p');
        contentParagraph.textContent = message.text;

        // Create a timestamp element for the date and time
        var timestampElement = document.createElement('timestamp');
        timestampElement.textContent = `(${message.timestamp})`;

        // Append content and timestamp to the message container
        messageDiv.appendChild(contentParagraph);
        messageDiv.appendChild(timestampElement);

        // Append the message container to the messages container
        messagesContainer.prepend(messageDiv);
      });

      // Scroll to the bottom to show the latest message
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    });
}
