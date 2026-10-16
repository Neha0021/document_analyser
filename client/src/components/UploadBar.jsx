function UploadBar({ fileName, uploading, onFileSelected }) {
  return (
    <div className="upload-bar">
      <label className="upload-button">
        {uploading ? "Uploading..." : "Choose file"}
        <input
          type="file"
          accept=".pdf,.txt,.png,.jpg,.jpeg,application/pdf,text/plain,image/png,image/jpeg"
          disabled={uploading}
          onChange={(event) => {
            const file = event.target.files?.[0];
            event.target.value = "";
            if (file) onFileSelected(file);
          }}
        />
      </label>
      <p className="upload-status">
        {fileName ? `Uploaded: ${fileName}` : "Upload a PDF, TXT, PNG, or JPG to start chatting"}
      </p>
    </div>
  );
}

export default UploadBar;
