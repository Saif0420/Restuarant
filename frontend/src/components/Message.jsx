import './Message.css';

function formatTime(isoString) {
  return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function Message({ sender, text, timestamp }) {
  const isUser = sender === 'user';

  return (
    <li className={`message-row ${isUser ? 'from-user' : 'from-bot'}`}>
      <div className="bubble">
        <p className="bubble-text">{text}</p>
        <time className="bubble-time" dateTime={timestamp}>
          {formatTime(timestamp)}
        </time>
      </div>
    </li>
  );
}

export default Message;