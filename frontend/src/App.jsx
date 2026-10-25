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

  function handleReset() {
  setMessages([
    createMessage('bot', 'Welcome to ByteBites! What would you like to order?'),
  ]);
  }

  function handleSend(text) {
    setMessages((previous) => [
      ...previous,
      createMessage('user', text),
      createMessage('bot', `(test) You said: ${text}`),
    ]);
  }

  function handleExport() {
    const exportData = {
      application: 'ByteBites',
      exportedAt: new Date().toISOString(),
      messageCount: messages.length,
      messages,
    };

    const json = JSON.stringify(exportData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = `bytebites-chat-${new Date()
      .toISOString()
      .replace(/[:.]/g, '-')}.json`;

    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="app-shell">
      <div className="chat-card card shadow-sm">
        <Header />
        <MessageList messages={messages} />

        <div className="card-footer chat-footer">
          <div className="chat-controls">
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm"
              onClick={handleReset}
            >
              Reset conversation
            </button>

            <button
              type="button"
              className="btn btn-outline-secondary btn-sm"
              onClick={handleExport}
              disabled={messages.length === 0}
            >
              Export conversation (JSON)
            </button>
          </div>

          <MessageInput onSend={handleSend} />
        </div>
      </div>
    </div>
  );
}

export default App;
