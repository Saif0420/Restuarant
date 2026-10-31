import './Header.css';

function Header({ isConnected }) {
  return (
    <header className="chat-header">
      <div>
        <h1 className="chat-title">ByteBites</h1>
        <p className="chat-subtitle">Your restaurant ordering assistant</p>
      </div>
      <span className={`status ${isConnected ? 'status-online' : 'status-offline'}`}>
        {isConnected ? 'Online' : 'Connecting…'}
      </span>
    </header>
  );
}

export default Header;