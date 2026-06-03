import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./WelcomePage.css";

const quotes = [
  "Family is not an important thing, it's everything.",
  "In family life, love is the oil that eases friction.",
  "The love of a family is life's greatest blessing.",
  "Family means nobody gets left behind or forgotten.",
  "A happy family is but an earlier heaven."
];

const placeholderPhotos = [
  "https://images.unsplash.com/photo-1511895426328-dc8714191011?w=800&q=80",
  "https://images.unsplash.com/photo-1609220136736-443140cffec6?w=800&q=80",
  "https://images.unsplash.com/photo-1478313393368-ee982fcf5427?w=800&q=80",
];

export default function WelcomePage() {
  const navigate = useNavigate();
  const [currentPhoto, setCurrentPhoto] = useState(0);
  const [currentQuote, setCurrentQuote] = useState(0);
  const [fadePhoto, setFadePhoto] = useState(true);
  const [fadeQuote, setFadeQuote] = useState(true);
  const [entered, setEntered] = useState(false);
  const [stars, setStars] = useState([]);

  // GENERATE STARS
  useEffect(() => {
    const s = Array.from({ length: 80 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 4
    }));
    setStars(s);
  }, []);

  // PHOTO SLIDESHOW
  useEffect(() => {
    const interval = setInterval(() => {
      setFadePhoto(false);
      setTimeout(() => {
        setCurrentPhoto(prev => (prev + 1) % placeholderPhotos.length);
        setFadePhoto(true);
      }, 600);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // QUOTE ROTATION
  useEffect(() => {
    const interval = setInterval(() => {
      setFadeQuote(false);
      setTimeout(() => {
        setCurrentQuote(prev => (prev + 1) % quotes.length);
        setFadeQuote(true);
      }, 500);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleEnter = () => {
    setEntered(true);
    setTimeout(() => navigate("/family"), 800);
  };

  return (
    <div className={`wp-page ${entered ? "wp-exit" : ""}`}>

      {/* STARS */}
      <div className="wp-stars">
        {stars.map(star => (
          <div
            key={star.id}
            className="wp-star"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: star.size,
              height: star.size,
              animationDuration: `${star.duration}s`,
              animationDelay: `${star.delay}s`
            }}
          />
        ))}
      </div>

      {/* FLOATING PARTICLES */}
      <div className="wp-particles">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="wp-particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${6 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      {/* MAIN CONTENT */}
      <div className="wp-content">

        {/* TOP TITLE */}
        <div className="wp-top">
          <p className="wp-subtitle">Welcome to</p>
          <h1 className="wp-title">
            <span className="wp-title-gandesri">Gandesri</span>
            <span className="wp-title-family"> Family</span>
          </h1>
          <div className="wp-divider">
            <span></span><span>❤️</span><span></span>
          </div>
        </div>

        {/* PHOTO SLIDESHOW */}
        <div className="wp-slideshow">
          <div className="wp-slide-frame">
            <img
              src={placeholderPhotos[currentPhoto]}
              alt="family"
              className={`wp-slide-img ${fadePhoto ? "fade-in" : "fade-out"}`}
            />
            <div className="wp-slide-overlay"></div>

            {/* DOTS */}
            <div className="wp-dots">
              {placeholderPhotos.map((_, i) => (
                <div
                  key={i}
                  className={`wp-dot ${i === currentPhoto ? "active" : ""}`}
                  onClick={() => setCurrentPhoto(i)}
                />
              ))}
            </div>
          </div>

          {/* DECORATIVE FRAMES */}
          <div className="wp-frame-deco wp-frame-1"></div>
          <div className="wp-frame-deco wp-frame-2"></div>
        </div>

        {/* QUOTE */}
        <div className={`wp-quote ${fadeQuote ? "fade-in" : "fade-out"}`}>
          <span className="wp-quote-mark">"</span>
          {quotes[currentQuote]}
          <span className="wp-quote-mark">"</span>
        </div>

        {/* SENTIMENTAL TEXT */}
        <p className="wp-sentiment">
          Every memory, every smile, every moment —<br />
          <strong>cherished forever in our hearts.</strong>
        </p>

        {/* ENTER BUTTON */}
        <button className="wp-enter-btn" onClick={handleEnter}>
          <span>Enter Family Album</span>
          <span className="wp-btn-arrow">→</span>
        </button>

        {/* MEMBERS PREVIEW */}
        <div className="wp-avatars">
          {["G", "S", "R", "V", "K"].map((letter, i) => (
            <div
              key={i}
              className="wp-avatar"
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              {letter}
            </div>
          ))}
          <span className="wp-avatars-text">& many more...</span>
        </div>

      </div>
    </div>
  );
}