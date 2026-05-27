import React from "react";
import "./CommandsList.css";

const commands = [
  { cmd: "hello", response: "Hello this is Sai Assistant how can I help you!" },
  { cmd: "what is your name", response: "Jarvis" },
  { cmd: "who created you", response: "Gandesri Saikumar" },
  { cmd: "open youtube", response: "Opening YouTube (opens youtube.com)" },
  { cmd: "open instagram", response: "Opening Instagram (opens instagram.com)" },
  { cmd: "open google", response: "Opening Google (opens google.com)" },
  { cmd: "open facebook", response: "Opening Facebook (opens facebook.com)" },
  { cmd: "open dashboard", response: "Opening Component (/Family)" },
  { cmd: "open contacts", response: "Opening Contacts (/Contacts)" },
  { cmd: "open notes", response: "Opening Notes (/Notes)" },
  { cmd: "open vignesh", response: "Opening Vignesh Album (/vigneshAlbum)" },
  { cmd: "open commands", response: "Opening Commands (/Commands)" },
  { cmd: "who is your boss", response: "Sai Kumar" },
  { cmd: "unknown command", response: "I didn't understand." }
];

export default function CommandsList() {
  return (
    <div className="commands-container">
      <h2 className="commands-title">Voice Commands</h2>
      <div className="commands-grid">
        {commands.map((item, index) => (
          <div key={index} className="command-card">
            <p className="command-text">🗣 {item.cmd}</p>
            <p className="command-response">➡ {item.response}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
