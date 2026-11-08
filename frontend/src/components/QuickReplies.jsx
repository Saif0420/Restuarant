import './QuickReplies.css';

function QuickReplies({ suggestions, onSelect, disabled = false }) {
  if (suggestions.length === 0) return null;

  return (
    <div className="quick-replies" role="group" aria-label="Suggested replies">
      {suggestions.map((suggestion) => (
        <button
          key={suggestion}
          type="button"
          className="btn btn-sm quick-reply"
          onClick={() => onSelect(suggestion)}
          disabled={disabled}
        >
          {suggestion}
        </button>
      ))}
    </div>
  );
}

export default QuickReplies;