const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Create upload directories if they don't exist
const createUploadDirs = () => {
  const dirs = [
    path.join(__dirname, "../uploads/"),
    path.join(__dirname, "../uploads/users/"),
    path.join(__dirname, "../uploads/posts/"),
    path.join(__dirname, "../uploads/messages/")
  ];
  
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

// Create directories on startup
createUploadDirs();

// Set storage engine with dynamic destination based on file type
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath = path.join(__dirname, "../uploads/");
    
    // Determine upload path based on route or request properties
    if (req.baseUrl.includes('/user')) {
      uploadPath = path.join(__dirname, "../uploads/users/");
    } else if (req.baseUrl.includes('/post')) {
      uploadPath = path.join(__dirname, "../uploads/posts/");
    } else if (req.baseUrl.includes('/message')) {
      uploadPath = path.join(__dirname, "../uploads/messages/");
    }
    
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname.replace(/\s+/g, '-'));
  },
});

// File filter for images only
function fileFilter(req, file, cb) {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);
  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"));
  }
}

// Create multer instances for different upload types
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: fileFilter,
});

module.exports = upload;
