const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { text } = require("stream/consumers");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Create HTTP Server
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: [
            "http://localhost:5173",
            "http://localhost:3000"
        ],
        methods: ["GET", "POST"]
    }
});

// HTTP route
app.get("/", (req, res) => {
    res.send("ByteBites backend is running!");
});

io.on("connection", (socket) => {
    console.log("A client connected to ByteBites!", socket.id);

    socket.on("chat:message", (data) => {
        console.log("Received message:", data);

        const message = 
        typeof data === "string" ? data : data?.message;

        if (!message || typeof message !== "string") {
            socket.emit("chat:response", {
                success: false,
                text: "Please enter a valid message."
            });
            return;
        }

        socket.emit("chat:response", {
            success: true,
            type: "message",
            text: "Hello! ByteBites received your message."
        });
    });

    socket.on("disconnect", (reason) => {
        console.log("Client disconnected:", socket.id, reason);
    });
});

server.listen(PORT, () => {
    console.log(`ByteBites server running on port ${PORT}`)
});
    