const express = require("express");
const http = require("http");
const cors = require("cors");
const dotenv = require("dotenv");
const { Server } = require("socket.io");
const path = require("path");

dotenv.config();

const sequelize = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const chatRoutes = require("./routes/chatRoutes");
const profileRoutes = require("./routes/profileRotes");
const messageRoutes = require("./routes/messageRoutes");

const Message = require("./models/Message");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const onlineUsers = new Map();

(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ PostgreSQL Connected");

    await sequelize.sync();
    console.log("✅ Database Synced");

    app.use(cors());
    app.use(express.json());

    app.use("/api/auth", authRoutes);
    app.use("/api/chat", chatRoutes);
    app.use("/api/profile", profileRoutes);
    app.use("/api/message", messageRoutes);
    app.use("/uploads", express.static(path.join(__dirname, "uploads")));

    // ================= SOCKET.IO =================
    io.on("connection", (socket) => {
      console.log("User Connected:", socket.id);

      // JOIN USER
      socket.on("join", (userId) => {
  if (!userId) return;

  const id = Number(userId); // 🔥 IMPORTANT FIX

  onlineUsers.set(id, socket.id);

  console.log("User joined:", id);
  console.log("Online Users:", [...onlineUsers.entries()]);
});

      // ================= SEND MESSAGE (FIXED) =================
      socket.on("send_message", async (data) => {
        try {
          console.log("===== SEND MESSAGE EVENT =====");

          // 🔥 1. SAVE TO DATABASE (FIXED FIELD NAME)
          const msg = await Message.create({
              sender: Number(data.sender),
              receiver: Number(data.receiver),
              message: data.text,
         });
         console.log("Saved Message:", msg.toJSON());

          const receiverSocketId = onlineUsers.get(Number(data.receiver));
          const senderSocketId = onlineUsers.get(Number(data.sender));

          console.log("Receiver:", data.receiver, receiverSocketId);
          console.log("Sender:", data.sender, senderSocketId);

          if (receiverSocketId) {
          io.to(receiverSocketId).emit("receive_message", msg);
        }

          if (senderSocketId) {
          io.to(senderSocketId).emit("receive_message", msg);
        }

        } catch (error) {
          console.log("Message save error:", error);
        }
      });

      // DISCONNECT CLEANUP
      socket.on("disconnect", () => {
        console.log("User Disconnected:", socket.id);

        for (let [userId, socketId] of onlineUsers.entries()) {
          if (socketId === socket.id) {
            onlineUsers.delete(userId);
            break;
          }
        }
      });
    });

    // START SERVER
    const PORT = process.env.PORT || 5000;

    server.listen(PORT, () => {
      console.log("Server running on port", PORT);
    });

  } catch (err) {
    console.error("Database connection failed:", err);
  }
})();