const crypto = require("crypto");
const path = require("path");
const express = require("express");
const multer = require("multer");
const { documents } = require("../store");

const router = express.Router();

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const ALLOWED_MIME_TYPES = new Set([
  "application/pdf",
  "text/plain",
  "image/png",
  "image/jpeg",
  "image/jpg",
]);

const ALLOWED_EXTENSIONS = new Set([".pdf", ".txt", ".png", ".jpg", ".jpeg"]);

function isAllowedFile(file) {
  const ext = path.extname(file.originalname || "").toLowerCase();
  return ALLOWED_MIME_TYPES.has(file.mimetype) && ALLOWED_EXTENSIONS.has(ext);
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter(req, file, cb) {
    if (isAllowedFile(file)) {
      cb(null, true);
      return;
    }

    const error = new Error(
      "Unsupported file type. Allowed types: PDF, TXT, PNG, JPG"
    );
    error.status = 400;
    error.code = "UNSUPPORTED_TYPE";
    cb(error);
  },
});

router.post("/", (req, res, next) => {
  upload.single("file")(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          error: "File too large. Maximum size is 10MB",
        });
      }

      if (err.code === "UNSUPPORTED_TYPE" || err.status === 400) {
        return res.status(400).json({ error: err.message });
      }

      return next(err);
    }

    if (!req.file) {
      return res.status(400).json({
        error: 'Missing file. Upload a single file in the form field named "file"',
      });
    }

    const documentId = crypto.randomUUID();

    documents.set(documentId, {
      buffer: req.file.buffer,
      mimeType: req.file.mimetype,
      fileName: req.file.originalname,
    });

    res.json({
      documentId,
      fileName: req.file.originalname,
    });
  });
});

module.exports = router;
