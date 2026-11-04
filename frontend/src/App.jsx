import { useEffect, useState } from 'react';
import { socket } from './socket';
import { downloadChatAsJson } from './utils/exportChat';
import Header from './components/Header';
import MessageList from './components/MessageList';
import MessageInput from './components/MessageInput';
import Controls from './components/Controls';
import './App.css';

let nextId = 0;

function createMessage(sender, text, timestamp = new Date().toISOString()) {
  nextId += 1;
  return { id: nextId, sender, text, timestamp };
}

// Accept { text, timestamp } as agreed, or a plain string like the lecture example
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
      setMessages([]);        // every new connection is a new conversation on the server
      setIsWaiting(true);     // the greeting is on its way
    }

    function handleDisconnect() {
      setIsConnected(false);
      setIsWaiting(false);
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
  }, []); // [] = run once when App first appears

  function handleSend(text) {
    const message = createMessage('user', text);
    setMessages((previous) => [...previous, message]);
    setIsWaiting(true);
    socket.emit('question', {
      text: message.text,
      timestamp: message.timestamp,
    });
  }

  function handleReset() {
    const confirmed = window.confirm(
      'Are you sure you want to reset this conversation? This action cannot be undone.'
    );

    if (!confirmed) {
      return;
    }

    setMessages([]);          // clear the screen at once
    setExportError('');
    setIsWaiting(true);       // the server answers with a fresh greeting
    socket.emit('reset');
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
    <main className="app-shell">
      <div className="chat-card card shadow-sm">
        <Header isConnected={isConnected} />
        <MessageList messages={messages} isWaiting={isWaiting} />
        {exportError && (
          <p className="export-error" role="alert">
            {exportError}
          </p>
        )}

        <div className="card-footer chat-footer">
          <Controls
            onExport={handleExport}
            onReset={handleReset}
            canExport={messages.length > 0}
            canReset={isConnected}
          />
          <MessageInput
            onSend={handleSend}
            disabled={!isConnected}
            isBusy={isWaiting}
          />
        </div>
      </div>
    </main>
  );
}

export default App;
