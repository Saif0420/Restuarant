import { io } from 'socket.io-client';

// No URL = same server that served the page (the Vite proxy in dev, Express in production).
// autoConnect: false lets App attach its listeners first, then connect.
export const socket = io({ autoConnect: false });

// Event names agreed with the backend, kept in one place
export const EVENTS = {
  QUESTION: 'chat:message',   // browser to server: { message, timestamp }
  ANSWER: 'chat:response',    // server to browser: { text, timestamp?, success? }
  RESET: 'chat:reset',        // browser to server: start the conversation again
};
