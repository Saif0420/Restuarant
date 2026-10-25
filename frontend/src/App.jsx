import { useState } from 'react';
import Header from './components/header';
import MessageList from './components/MessageList';
import MessageInput from './components/MessageInput';
import './App.css';

let nextId = 0;

function createMessage(sender, text, timestamp = new Date().toISOString()) {
  nextId += 1;
  return { id: nextId, sender, text, timestamp };
}

function App() {
  const [messages, setMessages] = useState(() => [
    createMessage('bot', 'Welcome to ByteBites! What would you like to order?'),
  ]);

  function handleSend(text) {
    // Temporary echo until the backend is connected in step 7
    setMessages((previous) => [
      ...previous,
      createMessage('user', text),
      createMessage('bot', `(test) You said: ${text}`),
    ]);
  }

  return (
    <div className="app-shell">
      <div className="chat-card card shadow-sm">
        <Header />
        <MessageList messages={messages} />
        <div className="card-footer chat-footer">
          <MessageInput onSend={handleSend} />
        </div>
      </div>
    </div>
  );
}

export default App;