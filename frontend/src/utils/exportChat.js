export function downloadChatAsJson(messages) {
  // Keep only what the brief asks for: sender, text, timestamp
  const history = messages.map(({ sender, text, timestamp }) => ({ sender, text, timestamp }));
  const json = JSON.stringify({ exportedAt: new Date().toISOString(), messages: history }, null, 2);

  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `bytebites-chat-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.json`;
  link.click();

  setTimeout(() => URL.revokeObjectURL(url), 0); // free the memory after the download starts
}