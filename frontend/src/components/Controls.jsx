import './Controls.css';

function Controls({ onExport, onReset, canExport, canReset }) {
  return (
    <div className="controls">
      <button type="button" className="btn btn-sm btn-outline-secondary" onClick={onExport} disabled={!canExport}>
        Export chat (.json)
      </button>
      <button type="button" className="btn btn-sm btn-outline-danger" onClick={onReset} disabled={!canReset}>
        Reset
      </button>
    </div>
  );
}

export default Controls;