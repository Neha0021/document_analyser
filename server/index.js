require("dotenv").config();

const express = require("express");
const cors = require("cors");
const uploadRouter = require("./routes/upload");
const chatRouter = require("./routes/chat");

const app = express();
const PORT = Number.parseInt(process.env.PORT, 10) || 5000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/upload", uploadRouter);
app.use("/api", chatRouter);

app.use((err, req, res, next) => {
  const status = err.status || err.statusCode || 500;
  res.status(status).json({
    error: err.message || "Internal Server Error",
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
