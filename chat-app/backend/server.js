const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5176",
    methods: ["GET", "POST"],
  },
});
io.on("connection", (socket) => {
    console.log("User Connected:", socket.id);

    socket.on("send_message", (data) => {
        io.emit("receive_message", data);
    });
    socket.on("disconnect", () =>{
        console.log("User Disconnected:", socket.id);
    });
});
app.get("/",(req, res) => {
    res.send("Backend Running 🚀");
});

server.listen(5000, () => {
    console.log("Server running on port 5000");
});