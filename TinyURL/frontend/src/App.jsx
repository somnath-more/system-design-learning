import { useState } from "react";
import "./App.css";

function App() {
  const [longUrl, setLongUrl] = useState("");
  const [shortCode, setShortCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8080/tinyurl/shorten", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ originalUrl: longUrl }),
      });

      const data = await response.json(); // Assuming backend returns {"shortCode": "abc123"}
      console.log("Short code from backend:", data);

      setShortCode(data.shortCode || data); // handle both object or plain string
      setLongUrl("");
    } catch (error) {
      console.error("Error shortening URL:", error);
    } finally {
      setLoading(false);
    }
  };

  // Construct the full short URL
  const shortUrl = shortCode ? `http://localhost:8080/tinyurl/${shortCode}` : "";

  return (
    <div className="AppContainer">
      <h1>TinyURL Clone</h1>
      <input
        type="text"
        className="inputBox"
        placeholder="Enter URL"
        value={longUrl}
        onChange={(e) => setLongUrl(e.target.value)}
      />
      <button className="buttonBox" onClick={handleSubmit}>
        {loading ? "Loading..." : "Shorten"}
      </button>

      {shortUrl && (
        <p className="ShortenedURL">
          Shortened URL:{" "}
          <a
            href={shortUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}
          >
            {shortUrl}
          </a>
        </p>
      )}
    </div>
  );
}

export default App;
