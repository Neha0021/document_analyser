function MessageList({ messages, isThinking }) {
  if (messages.length === 0 && !isThinking) {
    return (
      <div className="message-list empty">
        <p>Ask a question about your document.</p>
      </div>
    );
  }

  return (
    <div className="message-list">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`bubble ${message.role === "user" ? "user" : "ai"}`}
        >
          {message.text}
        </div>
      ))}
      {isThinking ? <div className="bubble ai thinking">Thinking...</div> : null}
    </div>
  );
}

export default MessageList;
