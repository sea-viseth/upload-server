const express = require("express");
const fs = require("fs");
const multer = require("multer");
const path = require("path");
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
app.use("/public/", express.static(path.join(__dirname, "public/")));

// ===== check if public folder exist ====
if (!fs.existsSync("./public")) {
  fs.mkdirSync("./public/video", { recursive: true });
  fs.mkdirSync("./public/image", { recursive: true });
}
// ===== set file path/name =====
const fileStorageEngineVideo = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/video");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "--" + file.originalname);
  },
});

const fileStorageEngineImage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/image");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "--" + file.originalname);
  },
});

//==== middleware ====
const uploadVideo = multer({ storage: fileStorageEngineVideo });
const uploadImage = multer({ storage: fileStorageEngineImage });

app.get("/", (_, res) => {
  res.sendFile(path.join(__dirname, "home.html"));
});

// === upload images ===
app.post("/upload-images", uploadImage.array("images"), (req, res) => {
  res.json({ data: req.files[0].filename });
});

// ==== upload video ====
app.post("/upload-videos", uploadVideo.array("videos"), (req, res) => {
  res.json({ data: req.files[0].filename });
});

// ==== delete file ====
// app.post("/delete-video", (req, res) => {
//   let videoPath = path.join(__dirname, "/public/video/" + req.body.video);
//   if (fs.existsSync(videoPath)) {
//     fs.unlinkSync(videoPath);
//     ``;
//   }
//   res.send("Video Deleted!");
// });

// app.post("/delete-image", (req, res) => {
//   let imagePath = path.join(__dirname, "/public/image/" + req.body.image);
//   if (fs.existsSync(imagePath)) {
//     fs.unlinkSync(imagePath);
//     ``;
//   }
//   res.send("Image Deleted!");
// });

const PORT = 3000;
app.listen(PORT, console.log("Server PORT:", PORT));
