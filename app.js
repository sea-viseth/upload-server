const express = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const cors = require("cors");

// ==== invoke application ====
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:4000", "http://192.168.1.8:4000"],
    credentials: true,
  })
);
app.use("/", express.static(path.join(__dirname, "public/")));

// ===== check if public folder exist ====
if (!fs.existsSync("./public")) {
  fs.mkdirSync("./public/video", { recursive: true });
}
// ===== set file path & name =====
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/video");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "--" + file.originalname);
  },
});
const maxSize = 15 * 1024 * 1024; //15mb

//==== upload validation ====
const uploadVideo = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype == "video/mp4") {
      cb(null, true);
    } else {
      return cb(
        new multer.MulterError("LIMIT_UNEXPECTED_FILE", {
          response: "Only .mp4 is allowed!",
        }),
        false
      );
    }
  },
  limits: { fileSize: maxSize },
}).single("video");

// ==== upload video ====
app.post("/upload-video", (req, res) => {
  uploadVideo(req, res, (err) => {
    // === Multer error ===
    if (err instanceof multer.MulterError) {
      if (err.code == "LIMIT_FILE_SIZE") {
        return res.status(400).send({
          ...err,
          field: { response: "Only video size of 15mb and below is allowed!" },
        });
      } else if (err.code == "LIMIT_UNEXPECTED_FILE") {
        return res.status(400).send(err);
      }
    }
    // Everything went fine.
    res.status(200).send(req.file);
  });
});

const PORT = 3000;
app.listen(PORT, console.log("Server PORT:", PORT));
