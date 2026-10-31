import { useEffect, useState } from 'react';
import { socket } from './socket';
import Header from './components/Header';
import MessageList from './components/MessageList';
import MessageInput from './components/MessageInput';
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
  }, []); // [] = run once when App first appears

  function handleSend(text) {
    const message = createMessage('user', text);
    setMessages((previous) => [...previous, message]);
    setIsWaiting(true);
    socket.emit('question', { text: message.text, timestamp: message.timestamp });
  }

  return (
    <div className="app-shell">
      <div className="chat-card card shadow-sm">
        <Header isConnected={isConnected} />
        <MessageList messages={messages} isWaiting={isWaiting} />
        <div className="card-footer chat-footer">
          <MessageInput onSend={handleSend} disabled={!isConnected} />
        </div>
      </div>
    </div>
  );
}

export default App;