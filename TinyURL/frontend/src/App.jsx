import { useState } from "react";
import "./App.css";

function App() {
  const [longUrl, setLongUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const handleSubmit = async () => {
    const response = await fetch("http://localhost:8080/shorten", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ longUrl }),
    });
    const data = await response.json();
    setShortUrl(data.shortUrl);
  };
  return (
    <div className="AppContainer">
      <h1>TinyURL Clone</h1>
      <form onSubmit={handleSubmit}></form>
      <input
        type="text"
        className="inputBox"
        placeholder="Enter URL"
        onChange={(e) => {
          setLongUrl(e.target.value);
        }}
      />
      <button className="buttonBox" type="submit">Shorten</button>
      {/* {shortUrl && ( */}
        <p className="ShortenedURL">Shortened URL: <a href={shortUrl}>{shortUrl}</a></p>
      {/* )} */}
    </div>
  );
}

export default App;
