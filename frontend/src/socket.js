import { io } from 'socket.io-client';

// No URL = same server that served the page (the Vite proxy in dev, Express in production).
// autoConnect: false lets App attach its listeners first, then connect.
export const socket = io({ autoConnect: false });

// Event names agreed with the backend, kept in one place
export const EVENTS = {
  QUESTION: 'question',   // browser to server: the user's message
  ANSWER: 'answer',       // server to browser: the bot's reply or greeting
  RESET: 'reset',         // browser to server: start the conversation again
};
