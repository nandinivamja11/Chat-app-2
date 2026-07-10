const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/chat/");
  },

  filename: function (req, file, cb) {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);

    cb(null, uniqueName);
  },
});

const allowedMimeTypes = [
  // Images
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",

  // Videos
  "video/mp4",
  "video/quicktime",
  "video/x-msvideo",

  // Audio
  "audio/mpeg",
  "audio/wav",
  "audio/ogg",

  // PDF
  "application/pdf",

  // Word
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

  // Zip
  "application/zip",
  "application/x-zip-compressed",
];

const fileFilter = (req, file, cb) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Unsupported file type"));
  }
};

module.exports = multer({
  storage,
  fileFilter,
});