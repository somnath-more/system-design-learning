import { useState } from "react";
import "./App.css";

function App() {
  const [message, setMessage] = useState("");
  const callApi = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/limiter");

      if (res.status === 429) {
        setMessage("Rate limit exceeded 🚫 Try again later");
        return;
      }

      const text = await res.text();
      setMessage(text);
    } catch (err) {
      setMessage("Error calling API");
      console.log(err);
      
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <button onClick={callApi}>Call API</button>
      <p>{message}</p>
    </div>
  );
}

export default App;
