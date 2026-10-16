import { useState } from "react";
import { askQuestion, uploadDocument } from "./api";
import ChatInput from "./components/ChatInput";
import MessageList from "./components/MessageList";
import UploadBar from "./components/UploadBar";

function App() {
  const [documentId, setDocumentId] = useState(null);
  const [fileName, setFileName] = useState("");
  const [messages, setMessages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [error, setError] = useState("");

  async function handleFileSelected(file) {
    setError("");
    setUploading(true);
    try {
      const result = await uploadDocument(file);
      setDocumentId(result.documentId);
      setFileName(result.fileName);
      setMessages([]);
    } catch (err) {
      setError(err.message || "Could not upload the file. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  async function handleSend(question) {
    if (!documentId) return;
    setError("");
    setMessages((current) => [
      ...current,
      { id: crypto.randomUUID(), role: "user", text: question },
    ]);
    setThinking(true);
    try {
      const result = await askQuestion(documentId, question);
      setMessages((current) => [
        ...current,
        { id: crypto.randomUUID(), role: "ai", text: result.answer },
      ]);
    } catch (err) {
      setError(err.message || "Could not get an answer. Please try again.");
    } finally {
      setThinking(false);
    }
  }

  return (
    <main className="app">
      <header>
        <h1>Document analyser</h1>
        <p>Upload a document, then ask questions about it.</p>
      </header>

      <UploadBar
        fileName={fileName}
        uploading={uploading}
        onFileSelected={handleFileSelected}
      />

      {error ? <p className="error">{error}</p> : null}

      <MessageList messages={messages} isThinking={thinking} />

      <ChatInput
        disabled={!documentId}
        sending={thinking}
        onSend={handleSend}
      />
    </main>
  );
}

export default App;
