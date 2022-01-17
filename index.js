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
    origin: ["http://localhost:3000", "http://192.168.1.8:3000"],
    credentials: true,
  })
);
app.use("/public/", express.static(path.join(__dirname, "public/video")));

// ===== check if public folder exist ====
if (fs.existsSync("./public/video")) {
  console.log("exist");
} else {
  fs.mkdirSync("./public/video", { recursive: true });
}

// ===== set file path/name =====
const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/video");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "--" + file.originalname);
  },
});

//==== middleware ====
const upload = multer({ storage: fileStorageEngine });

app.get("/", (_, res) => {
  res.sendFile(path.join(__dirname, "home.html"));
});

// ==== upload video ====
app.post("/upload-video", upload.single("video"), (req, res) => {
  res.json({ data: req.file.filename });
});

app.post("/upload-videos", upload.array("videos"), (req, res) => {
  res.json({ data: req.files[0].filename });
});

// ==== delete video ====
app.post("/delete", (req, res) => {
  let videoPath = path.join(__dirname, "/public/video/" + req.body.video);
  if (fs.existsSync(videoPath)) {
    fs.unlinkSync(videoPath);
    ``;
  }
  res.send("Video Deleted!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log("Server PORT:", PORT));
