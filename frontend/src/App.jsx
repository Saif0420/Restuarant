import { useEffect, useState } from 'react';
import { socket, EVENTS } from './socket';
import { downloadChatAsJson } from './utils/exportChat';
import Header from './components/Header';
import MessageList from './components/MessageList';
import MessageInput from './components/MessageInput';
import Controls from './components/Controls';
import QuickReplies from './components/QuickReplies';
import './App.css';

let nextId = 0;

function createMessage(sender, text, timestamp = new Date().toISOString(), suggestions = []) {
  nextId += 1;
  return { id: nextId, sender, text, timestamp, suggestions };
}

function toBotMessage(data) {
  if (typeof data === 'string') return createMessage('bot', data);
  const message = createMessage('bot', data.text, data.timestamp, data.suggestions ?? []);
  return data.success === false ? { ...message, isError: true } : message;
}

function App() {
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const [exportError, setExportError] = useState('');
  const [hasConnectionError, setHasConnectionError] = useState(false);

  useEffect(() => {
    function handleConnect() {
      setIsConnected(true);
      setHasConnectionError(false);
    }

    function handleDisconnect() {
      setIsConnected(false);
      setIsWaiting(false);
      setMessages([]);
    }

    function handleConnectError() {
      setHasConnectionError(true);
      setIsWaiting(false);
    }

    function handleAnswer(data) {
      setMessages((previous) => [...previous, toBotMessage(data)]);
      setIsWaiting(false);
    }

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('connect_error', handleConnectError);
    socket.on(EVENTS.ANSWER, handleAnswer);
    socket.connect();

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('connect_error', handleConnectError);
      socket.off(EVENTS.ANSWER, handleAnswer);
      socket.disconnect();
    };
  }, []);

  const lastMessage = messages.at(-1);
  const suggestions = lastMessage?.sender === 'bot' ? lastMessage.suggestions : [];

  function handleSend(text) {
    const message = createMessage('user', text);
    setMessages((previous) => [...previous, message]);
    setIsWaiting(true);
    socket.emit(EVENTS.QUESTION, {
      message: message.text,
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

    setMessages([]);
    setExportError('');
    setIsWaiting(true);
    socket.emit(EVENTS.RESET);
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
        {hasConnectionError && (
          <p className="connection-error" role="alert">
            Can't reach ByteBites right now. Trying to reconnect…
          </p>
        )}
        {exportError && (
          <p className="export-error" role="alert">
            {exportError}
          </p>
        )}

        <div className="card-footer chat-footer">
          <QuickReplies
            suggestions={suggestions}
            onSelect={handleSend}
            disabled={!isConnected || isWaiting}
          />
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
