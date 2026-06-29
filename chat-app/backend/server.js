// const express = require("express");
// const http = require("http");
// const { Server } = require("socket.io");
// const cors = require("cors");
// const app = express();
// let users = [];

// app.use(cors());
// app.use(express.json());
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:5176",
//     methods: ["GET", "POST"],
//   },
// });
// io.on("connection", (socket) => {
//     console.log("User Connected:", socket.id);

//     socket.on("send_message", (data) => {
//         io.emit("receive_message", data);
//     });
//     socket.on("disconnect", () =>{
//         console.log("User Disconnected:", socket.id);
//     });
// });
// app.get("/",(req, res) => {
//     res.send("Backend Running 🚀");
// });

// server.listen(5000, () => {
//     console.log("Server running on port 5000");
// });

const express = require("express");
const http = require("http");
const cors = require("cors");
const dotenv = require("dotenv");
const { Server } = require("socket.io");
const path = require("path");

dotenv.config();

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const chatRoutes = require("./routes/chatRoutes");
const profileRoutes = require("./routes/profileRotes");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

(async () => {
  await connectDB();

  app.use(cors());
  app.use(express.json());

  app.use("/api/auth", authRoutes);
  app.use("/api/chat", chatRoutes);
  app.use("/api/profile", profileRoutes);
  app.use("/uploads",
  express.static(path.join(__dirname, "uploads")));

  // Socket.io chat
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("send_message", (data) => {
      io.emit("receive_message", data);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });

  const PORT = process.env.PORT || 5000;

  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})();