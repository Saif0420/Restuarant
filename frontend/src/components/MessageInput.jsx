import { useState } from 'react';
import './MessageInput.css';

function MessageInput({ onSend, disabled = false }) {
  const [draft, setDraft] = useState('');

  function handleSubmit(event) {
    event.preventDefault();       // stop the browser from reloading the page
    const text = draft.trim();
    if (!text) return;            // ignore empty or whitespace-only input
    onSend(text);                 // tell the parent (App) about it
    setDraft('');                 // clear the field
  }

  return (
    <form className="message-input" onSubmit={handleSubmit}>
      <input
        type="text"
        className="form-control"
        placeholder="Type your message…"
        aria-label="Message"
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        disabled={disabled}
      />
      <button type="submit" className="btn btn-send" disabled={disabled || !draft.trim()}>
        Send
      </button>
    </form>
  );
}

export default MessageInput;