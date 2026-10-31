import { io } from 'socket.io-client';

// No URL = same server that served the page (the Vite proxy in dev, Flask in production).
// autoConnect: false lets App attach its listeners first, then connect.
export const socket = io({ autoConnect: false });