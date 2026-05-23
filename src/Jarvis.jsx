import { useEffect, useState } from "react";
import App from "./App";
import { useNavigate } from "react-router-dom"; // ✅ import this
import "./Jarvis.css";
//const navigate = useNavigate();


export default function Jarvis() {
  const navigate = useNavigate(); 
  const [menuOpen, setMenuOpen] = useState(false);
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("......");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("......");

  // Toggle Menu
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  

  // Speech Function
  const speak = (text) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    } else {
      console.log("Speech synthesis not supported");
    }
  };

  // Voice Recognition
  const listen = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition not supported");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase();

      setInputText(transcript);

      // Commands
      if (transcript.includes("hello")) {
        respond("Hello this is Sai Assistant how can I help you!");
      } else if (transcript.includes("what is your name")) {
        respond("Jarvis");
      } else if (transcript.includes("who created you")) {
        respond("Gandesri Saikumar");
      } else if (transcript.includes("open youtube")) {
        respond("Opening YouTube");
        window.open("https://www.youtube.com", "_blank");
      } else if (transcript.includes("open instagram")) {
        respond("Opening Instagram");
        window.open("https://www.instagram.com", "_blank");
      } else if (transcript.includes("open google")) {
        respond("Opening Google");
        window.open("https://www.google.com", "_blank");
      } else if (transcript.includes("open facebook")) {
        respond("Opening Facebook");
        window.open("https://www.facebook.com", "_blank");
      }else if (transcript.includes("open dashboard")) {
        respond("Opening  Component");
        navigate("/Family");
      }else if (transcript.includes("open contacts")) {
        respond("Opening  Contacts");
        navigate("/Contacts");
    }else if (transcript.includes("open notes")) {
        respond("Opening  Notes");
        navigate("/Notes");
    } else if (transcript.includes("open vignesh")) {
        respond("Opening  vignesh album");
        navigate("/FamilyPage");
      } else if (transcript.includes("who is your boss")) {
        respond("Sai Kumar");
      } else {
        respond("I didn't understand.");
      }
    };

    recognition.start();
  };

  // Response Function
  const respond = (message) => {
    setOutputText(message);
    speak(message);
  };

  // Question Answer Logic
  const getAnswer = (question) => {
    switch (question.toLowerCase()) {
      case "what is your name?":
        return "Jarvis";

      case "how does this work?":
        return "This is a simple Q&A example.";

      case "my favourite curry":
        return "Mom potato fry";

      case "who is your boss":
        return "Gandesri Saikumar";

      case "hello jarvis":
        return "Hello boss how is your day";

      case "open facebook":
        window.open("https://www.facebook.com", "_blank");
        return "Opening Facebook";

      default:
        return "I don't have an answer for that.";
    }
  };

  // Enter Key
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      const result = getAnswer(question);
      setAnswer(result);
      setQuestion("");
    }
  };

  // Close menu when clicking outside
  useEffect(() => {
    const closeMenu = (e) => {
      if (!e.target.matches(".menu-btn")) {
        setMenuOpen(false);
      }
    };

    window.addEventListener("click", closeMenu);

    return () => {
      window.removeEventListener("click", closeMenu);
    };
  }, []);

  return (
    <div className="container">
       {/* TITLE */}
      <p className="content">
        Welcome to Family 
        <br />
        Virtual AI
      </p>
      <div className="robot-section">
  <img
    src="https://cdn-icons-png.flaticon.com/512/4712/4712109.png"
    alt="jarvis"
    className="robot-image"
  />
</div>
      {/* MENU */}
      <div className="menu-img">
        <div className="menu-container">
          <button className="menu-btn" onClick={toggleMenu}>
            Menu
          </button>

          {menuOpen && (
            <div className="dropdown-content">
              <a href="#">Login</a>
              <a href="#">Profile</a>
              <a href="#">About</a>
              <a href="#">Help</a>
            </div>
          )}
        </div>
      </div>

     

      {/* SEARCH */}
      <div className="search-family">
        <input
          type="text"
          placeholder="Search here..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>

      {/* ANSWER */}
      <div className="answer">
        <p className="answerOutput">{answer}</p>
      </div>

      {/* VOICE BUTTON */}
      <div className="main-show">
        <button className="button" onClick={listen}>
          Start
        </button>
      </div>

      {/* SPEECH OUTPUT */}
      <div className="paragraphs">
        <p className="paragraph1">{inputText}</p>
        <p className="paragraph2">{outputText}</p>
      </div>
    </div>
  );
}
