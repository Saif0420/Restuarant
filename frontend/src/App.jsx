
import { useEffect, useState } from 'react';
import { socket } from './socket';
import { downloadChatAsJson } from './utils/exportChat';
import Header from './components/Header';
import MessageList from './components/MessageList';
import MessageInput from './components/MessageInput';
import './App.css';

let nextId = 0;

function createMessage(sender, text, timestamp = new Date().toISOString()) {
  nextId += 1;
  return { id: nextId, sender, text, timestamp };
}

function toBotMessage(data) {
  if (typeof data === 'string') return createMessage('bot', data);
  return createMessage('bot', data.text, data.timestamp);
}

function App() {
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const [exportError, setExportError] = useState('');

  useEffect(() => {
    function handleConnect() {
      setIsConnected(true);
      setIsWaiting(true);
    }

    function handleDisconnect() {
      setIsConnected(false);
      setIsWaiting(false);
      setMessages([]);
    }

    function handleAnswer(data) {
      setMessages((previous) => [...previous, toBotMessage(data)]);
      setIsWaiting(false);
    }

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('answer', handleAnswer);
    socket.connect();

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('answer', handleAnswer);
      socket.disconnect();
    };
  }, []);

  function handleReset() {
    const confirmed = window.confirm(
      'Are you sure you want to reset this conversation? This action cannot be undone.'
    );

    if (!confirmed) {
      return;
    }

    setMessages([
      createMessage('bot', 'Welcome to ByteBites! What would you like to order?'),
    ]);

    setExportError('');
  }

  function handleSend(text) {
    const message = createMessage('user', text);
    setMessages((previous) => [...previous, message]);
    setIsWaiting(true);
    socket.emit('question', {
      text: message.text,
      timestamp: message.timestamp,
    });
  }

  function handleExport() {
    try {
      setExportError('');
      downloadChatAsJson(messages);
    } catch (error) {
      console.error('Conversation export failed:', error);
      setExportError('Unable to export conversation. Please try again.');
    }
  }

  return (
    <div className="app-shell">
      <div className="chat-card card shadow-sm">
        <Header />
        <MessageList messages={messages} />

        {exportError && (
          <p className="export-error" role="alert">
            {exportError}
          </p>
        )}

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
