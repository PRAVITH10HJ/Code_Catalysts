import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    if (!uploadedFile) return;
    setFile(uploadedFile);
    setPreview(URL.createObjectURL(uploadedFile));
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please upload an image first.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://localhost:5000/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        responseType: "blob", // ✅ Ensures file is downloaded correctly
      });

      // Create a download link for the received file
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      });
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = "converted_slides.pptx";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      alert("✅ Slides have been successfully generated!");
    } catch (error) {
      console.error("❌ Upload failed", error);
      alert("⚠️ Error processing image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1 className="title">AI-Powered Smart Board to Slide Converter</h1>

      <div className="upload-container">
        <input type="file" accept="image/*" onChange={handleFileChange} />
        {preview && <img src={preview} alt="Preview" className="image-preview" />}

        <button onClick={handleUpload} disabled={loading || !file}>
          {loading ? "Processing..." : "Convert to Slides"}
        </button>
      </div>
    </div>
  );
}

export default App;
