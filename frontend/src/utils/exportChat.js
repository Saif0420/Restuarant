export function downloadChatAsJson(messages) {
  if (!Array.isArray(messages)) {
    throw new Error('Invalid conversation data.');
  }

  if (messages.length === 0) {
    throw new Error('There is no conversation to export.');
  }

  const history = messages.map(({ sender, text, timestamp }) => ({
    sender,
    text,
    timestamp,
  }));

  const exportData = {
    application: 'ByteBites',
    exportedAt: new Date().toISOString(),
    messageCount: history.length,
    messages: history,
  };

  const json = JSON.stringify(exportData, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  try {
    link.href = url;
    link.download = `bytebites-chat-${new Date()
      .toISOString()
      .replace(/[:.]/g, '-')}.json`;

    document.body.appendChild(link);
    link.click();
  } finally {
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}
