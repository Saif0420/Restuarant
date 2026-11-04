import { useEffect, useRef } from 'react';
import Message from './Message';
import './MessageList.css';

function MessageList({ messages, isWaiting }) {
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isWaiting]); // run again whenever either changes

  return (
    <ul className="message-list" aria-live="polite">
      {messages.map((message) => (
        <Message
          key={message.id}
          sender={message.sender}
          text={message.text}
          timestamp={message.timestamp}
          isError={message.isError}
        />
      ))}
      {isWaiting && (
        <li className="typing" aria-label="ByteBites is typing">
          <span /><span /><span />
        </li>
      )}
      <li ref={endRef} aria-hidden="true" />
    </ul>
  );
}

export default MessageList;