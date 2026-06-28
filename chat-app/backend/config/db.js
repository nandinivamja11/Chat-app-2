const mongoose = require("mongoose");

const connectDB = async () => {
  const envUri =
    process.env.MONGO_URI?.trim() ||
    process.env.MONGODB_URI?.trim() ||
    process.env.ATLAS_URI?.trim();
  const localUri = "mongodb://127.0.0.1:27017/chatapp";

  const connectTo = async (uri, label) => {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log(`MongoDB connected (${label})`);
  };

  const isLocalEnvUri = !!envUri && /^mongodb:\/\/(127\.0\.0\.1|localhost)(:\d+)?\//.test(envUri);

  if (envUri && !isLocalEnvUri) {
    try {
      await connectTo(envUri, "Atlas");
      return true;
    } catch (err) {
      console.warn("Atlas connection failed:", err.message || err);
      console.warn("Trying local MongoDB fallback...");
    }
  }

  const targetUri = envUri || localUri;
  const label = envUri ? "Local" : "Local";

  try {
    await connectTo(targetUri, label);
    return true;
  } catch (err) {
    console.error("MongoDB connection error:", err.message || err);
    console.error("Make sure MongoDB is installed and running on localhost:27017, or set MONGO_URI / MONGODB_URI / ATLAS_URI to a valid MongoDB Atlas URI.");
    console.warn("Starting backend without MongoDB connection. Auth and chat storage will be unavailable.");
    return false;
  }
};

module.exports = connectDB;
