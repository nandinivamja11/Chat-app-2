// const mongoose = require("mongoose");
// const { MongoMemoryServer } = require("mongodb-memory-server");

// let mongoServer;

// const connectDB = async () => {
//   const envUri =
//     process.env.MONGO_URI?.trim() ||
//     process.env.MONGODB_URI?.trim() ||
//     process.env.ATLAS_URI?.trim();
//   const localUri = "mongodb://127.0.0.1:27017/chatapp";

//   const connectTo = async (uri, label) => {
//     await mongoose.connect(uri, {
//       serverSelectionTimeoutMS: 10000,
//     });
//     console.log(`MongoDB connected (${label})`);
//   };

//   const connectWithMemoryFallback = async () => {
//     try {
//       mongoServer = await MongoMemoryServer.create();
//       const uri = mongoServer.getUri();
//       await connectTo(uri, "Memory");
//       return true;
//     } catch (error) {
//       console.error("MongoDB memory fallback failed:", error.message || error);
//       console.warn("Starting backend without MongoDB connection. Auth and chat storage will be unavailable.");
//       return false;
//     }
//   };

//   const isLocalEnvUri = !!envUri && /^mongodb:\/\/(127\.0\.0\.1|localhost)(:\d+)?\//.test(envUri);

//   if (envUri && !isLocalEnvUri) {
//     try {
//       await connectTo(envUri, "Atlas");
//       return true;
//     } catch (err) {
//       console.warn("Atlas connection failed:", err.message || err);
//       console.warn("Trying local MongoDB fallback...");
//     }
//   }

//   const targetUri = envUri || localUri;

//   try {
//     await connectTo(targetUri, envUri ? "Local" : "Local");
//     return true;
//   } catch (err) {
//     console.warn("Primary MongoDB connection failed:", err.message || err);
//     console.warn("Starting an embedded MongoDB instance for local development...");
//     return connectWithMemoryFallback();
//   }
// };

// module.exports = connectDB;

const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "postgres",
    logging: false,
  }
);

module.exports = sequelize;