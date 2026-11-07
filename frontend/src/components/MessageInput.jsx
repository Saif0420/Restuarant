import { useRef, useState } from 'react';
import './MessageInput.css';

const MAX_LENGTH = 500;

function MessageInput({ onSend, disabled = false, isBusy = false }) {
  const [draft, setDraft] = useState('');
  const inputRef = useRef(null);

  const canSend = !disabled && !isBusy && draft.trim() !== '';

  function handleSubmit(event) {
    event.preventDefault();       // stop the browser from reloading the page
    if (!canSend) return;         // empty input, offline, or the bot is still answering
    onSend(draft.trim());         // tell the parent (App) about it
    setDraft('');                 // clear the field
    inputRef.current?.focus();    // keep the cursor in the field for the next message
  }

  return (
    <form className="message-input" onSubmit={handleSubmit}>
      <input
        ref={inputRef}
        type="text"
        className="form-control"
        placeholder="Type your message…"
        aria-label="Message"
        maxLength={MAX_LENGTH}
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        disabled={disabled}
        autoFocus
      />
      <button type="submit" className="btn btn-send" disabled={!canSend}>
        Send
      </button>
    </form>
  );
}

export default MessageInput;
