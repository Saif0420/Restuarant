const express = require("express");
const WebSocket = require("ws");

const app = express();
const PORT = 3000;

// HTTP route
app.get("/", (req, res) => {
    res.send("ByteBites backend is running!");
});

// Starting of HTTP Server
const server = app.listen(PORT, () => {
    console.log(`ByteBites server running on port ${PORT}`);
});

// WebSocket server
const wss = new WebSocket.Server({ server });

wss.on("connection", (socket) => {
    console.log("A client connected to ByteBites!");

    socket.on("message", (message) => {
        console.log("Received:", message.toString());

        socket.send(
            JSON.stringify({
                type: "message",
                text: "Hello! ByteBites has recieved your message."
            })
        );
    });

    socket.on("close", () => {
        console.log("Client disconnected.");
    });
});