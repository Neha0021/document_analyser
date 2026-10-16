const express = require("express");
const { GoogleGenAI } = require("@google/genai");
const { documents } = require("../store");

const GEMINI_FLASH_MODEL = "gemini-3.8-flash";
const SYSTEM_INSTRUCTION =
  "Answer only using the provided document. If the answer isn't in the document, say so.";

const router = express.Router();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

router.post("/chat", async (req, res) => {
  const documentId =
    typeof req.body?.documentId === "string" ? req.body.documentId.trim() : "";
  const question =
    typeof req.body?.question === "string" ? req.body.question.trim() : "";

  if (!question) {
    return res.status(400).json({ error: "Question is required" });
  }

  const document = documents.get(documentId);
  if (!document) {
    return res.status(404).json({
      error: "Document not found. Upload a file first and use its documentId.",
    });
  }

  try {
    const parts = [];
    const isPlainText =
      document.mimeType === "text/plain" ||
      (document.fileName && document.fileName.toLowerCase().endsWith(".txt"));

    if (isPlainText) {
      parts.push({
        text: `Document (${document.fileName}):\n${document.buffer.toString("utf8")}`,
      });
    } else {
      parts.push({
        inlineData: {
          mimeType: document.mimeType,
          data: document.buffer.toString("base64"),
        },
      });
    }

    parts.push({ text: question });

    const response = await ai.models.generateContent({
      model: GEMINI_FLASH_MODEL,
      contents: parts,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });

    const answer = (response.text || "").trim();
    if (!answer) {
      return res.status(500).json({
        error: "Gemini returned an empty response",
      });
    }

    res.json({ answer });
  } catch (error) {
    const message =
      error?.error?.message ||
      error?.message ||
      "Failed to get a response from Gemini";
    res.status(500).json({ error: message });
  }
});

module.exports = router;
