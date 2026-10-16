import { useState } from "react";

function ChatInput({ disabled, sending, onSend }) {
  const [value, setValue] = useState("");

  function submit() {
    const question = value.trim();
    if (!question || disabled || sending) return;
    onSend(question);
    setValue("");
  }

  return (
    <form
      className="chat-input"
      onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}
    >
      <input
        type="text"
        value={value}
        disabled={disabled || sending}
        placeholder={
          disabled ? "Upload a document first" : "Ask about the document"
        }
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            submit();
          }
        }}
      />
      <button type="submit" disabled={disabled || sending}>
        Send
      </button>
    </form>
  );
}

export default ChatInput;
