# ByteBites frontend

The chat window of ByteBites, built with React 19, Vite and Bootstrap 5.
It talks to the backend over Socket.IO (WebSocket).

## Scripts

Run these in `frontend/`:

| Command | What it does |
| --- | --- |
| `npm install` | Installs the dependencies |
| `npm run dev` | Starts the dev server on http://localhost:5173 and forwards `/socket.io` to the backend on port 3000 |
| `npm run build` | Builds the production files into `frontend/dist` |
| `npm run preview` | Serves the production build locally |
| `npm run lint` | Checks the code with oxlint |

## Structure

| File | Job |
| --- | --- |
| `src/App.jsx` | Holds the messages and the socket connection |
| `src/socket.js` | The one shared Socket.IO connection and the event names |
| `src/components/Header.jsx` | Title and online status |
| `src/components/MessageList.jsx` | The question-and-answer list, scrolls to the newest message |
| `src/components/Message.jsx` | One message bubble with its time |
| `src/components/MessageInput.jsx` | Text field and Send button |
| `src/components/Controls.jsx` | Export and Reset buttons |
| `src/components/QuickReplies.jsx` | Buttons for the replies the bot suggests |
| `src/utils/exportChat.js` | Downloads the conversation as `.json` |

## Messages exchanged with the backend

| Event | Direction | Payload |
| --- | --- | --- |
| `chat:message` | browser to server | `{ message, timestamp }` |
| `chat:response` | server to browser | `{ text, timestamp?, success?, suggestions? }` |
| `chat:reset` | browser to server | none; the server answers with a new greeting |

The full setup manual is in the `README.md` at the repository root.