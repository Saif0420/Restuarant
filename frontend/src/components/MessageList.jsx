import Message from './Message';
import './MessageList.css';

function MessageList({ messages }) {
  return (
    <ul className="message-list">
      {messages.map((message) => (
        <Message
          key={message.id}
          sender={message.sender}
          text={message.text}
          timestamp={message.timestamp}
        />
      ))}
    </ul>
  );
}

export default MessageList;