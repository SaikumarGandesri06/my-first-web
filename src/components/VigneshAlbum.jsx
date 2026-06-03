import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./VigneshAlbum.css";

const API = "https://my-first-web-backend.onrender.com";

export default function VigneshAlbum() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [slideshow, setSlideshow] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);
  const [countdown, setCountdown] = useState(null);
  const [showMsgForm, setShowMsgForm] = useState(false);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [showPhotoForm, setShowPhotoForm] = useState(false);
  const [msgForm, setMsgForm] = useState({ name: "", message: "" });
  const [profileForm, setProfileForm] = useState({ name: "", tagline: "", dob: "" });
  const [photoCaption, setPhotoCaption] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [stars] = useState(() =>
    Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2.5 + 1,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 5
    }))
  );

  useEffect(() => {
    fetchData();
    if (localStorage.getItem("adminToken")) setIsAdmin(true);
  }, []);

  // BIRTHDAY COUNTDOWN
  useEffect(() => {
    if (!data?.dob) return;
    const calc = () => {
      const today = new Date();
      const dob = new Date(data.dob);
      const next = new Date(today.getFullYear(), dob.getMonth(), dob.getDate());
      if (next < today) next.setFullYear(today.getFullYear() + 1);
      const diff = next - today;
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);
      setCountdown({ days, hours, mins, secs });
    };
    calc();
    const interval = setInterval(calc, 1000);
    return () => clearInterval(interval);
  }, [data?.dob]);

  // SLIDESHOW AUTO
  useEffect(() => {
    if (!slideshow || !data?.photos?.length) return;
    const interval = setInterval(() => {
      setSlideIndex(prev => (prev + 1) % data.photos.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [slideshow, data?.photos?.length]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/vignesh`);
      const d = await res.json();
      setData(d);
      setProfileForm({ name: d.name || "", tagline: d.tagline || "", dob: d.dob || "" });
    } catch (e) { console.log(e); }
    setLoading(false);
  };

  const calcAge = (dob) => {
    if (!dob) return null;
    return Math.floor((new Date() - new Date(dob)) / (365.25 * 24 * 60 * 60 * 1000));
  };

  // SAVE PROFILE
  const saveProfile = async () => {
    setSaving(true);
    const token = localStorage.getItem("adminToken");
    const fd = new FormData();
    fd.append("name", profileForm.name);
    fd.append("tagline", profileForm.tagline);
    fd.append("dob", profileForm.dob);
    if (photoFile) fd.append("profilePhoto", photoFile);
    try {
      await fetch(`${API}/vignesh/profile`, {
        method: "PUT",
        headers: { authorization: token },
        body: fd
      });
      fetchData();
      setShowProfileForm(false);
      setPhotoFile(null);
    } catch (e) { alert("Error saving profile"); }
    setSaving(false);
  };

  // ADD PHOTO
  const addPhoto = async () => {
    if (!photoFile) { alert("Please select a photo"); return; }
    setSaving(true);
    const token = localStorage.getItem("adminToken");
    const fd = new FormData();
    fd.append("image", photoFile);
    fd.append("caption", photoCaption);
    try {
      await fetch(`${API}/vignesh/photos`, {
        method: "POST",
        headers: { authorization: token },
        body: fd
      });
      fetchData();
      setShowPhotoForm(false);
      setPhotoFile(null);
      setPhotoCaption("");
    } catch (e) { alert("Error adding photo"); }
    setSaving(false);
  };

  // DELETE PHOTO
  const deletePhoto = async (photoId) => {
    if (!window.confirm("Delete this photo?")) return;
    const token = localStorage.getItem("adminToken");
    await fetch(`${API}/vignesh/photos/${photoId}`, {
      method: "DELETE",
      headers: { authorization: token }
    });
    fetchData();
  };

  // ADD MESSAGE
  const addMessage = async () => {
    if (!msgForm.name || !msgForm.message) { alert("Please fill all fields"); return; }
    setSaving(true);
    try {
      await fetch(`${API}/vignesh/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(msgForm)
      });
      fetchData();
      setShowMsgForm(false);
      setMsgForm({ name: "", message: "" });
    } catch (e) { alert("Error sending message"); }
    setSaving(false);
  };

  // DELETE MESSAGE
  const deleteMessage = async (msgId) => {
    const token = localStorage.getItem("adminToken");
    await fetch(`${API}/vignesh/messages/${msgId}`, {
      method: "DELETE",
      headers: { authorization: token }
    });
    fetchData();
  };

  if (loading) return (
    <div className="va-loading">
      <div className="va-spinner"></div>
      <p>Loading Vignesh's Album...</p>
    </div>
  );

  return (
    <div className="va-page">

      {/* STARS */}
      <div className="va-stars">
        {stars.map(s => (
          <div key={s.id} className="va-star" style={{
            left: `${s.x}%`, top: `${s.y}%`,
            width: s.size, height: s.size,
            animationDuration: `${s.duration}s`,
            animationDelay: `${s.delay}s`
          }} />
        ))}
      </div>

      {/* ADMIN BAR */}
      <div className="va-admin-bar">
        {isAdmin ? (
          <div className="va-admin-controls">
            <span className="va-admin-badge">👑 Admin</span>
            <button className="va-abtn" onClick={() => setShowProfileForm(true)}>✏️ Edit Profile</button>
            <button className="va-abtn va-abtn-green" onClick={() => setShowPhotoForm(true)}>+ Photo</button>
            <button className="va-abtn va-abtn-red" onClick={() => { localStorage.removeItem("adminToken"); setIsAdmin(false); }}>Logout</button>
          </div>
        ) : (
          <button className="va-login-btn" onClick={() => navigate("/admin-login")}>🔐 Admin</button>
        )}
      </div>

      {/* HERO SECTION */}
      <div className="va-hero">
        <div className="va-hero-glow"></div>
        <div className="va-profile-ring">
          <img
            src={data?.profilePhoto || `https://ui-avatars.com/api/?name=Vignesh&background=6366f1&color=fff&size=400`}
            alt="Vignesh"
            className="va-profile-photo"
          />
        </div>
        <div className="va-hero-text">
          <p className="va-hero-sub">✨ Special Album for</p>
          <h1 className="va-hero-name">{data?.name || "Vignesh"}</h1>
          {data?.dob && (
            <p className="va-hero-age">🎂 {calcAge(data.dob)} years old</p>
          )}
          {data?.tagline && (
            <p className="va-hero-tagline">"{data.tagline}"</p>
          )}
        </div>

        {/* BIRTHDAY COUNTDOWN */}
        {countdown && (
          <div className="va-countdown">
            <p className="va-countdown-title">🎉 Next Birthday In</p>
            <div className="va-countdown-boxes">
              {[
                { val: countdown.days, label: "Days" },
                { val: countdown.hours, label: "Hours" },
                { val: countdown.mins, label: "Mins" },
                { val: countdown.secs, label: "Secs" }
              ].map((item, i) => (
                <div key={i} className="va-countdown-box">
                  <span className="va-countdown-num">{String(item.val).padStart(2, "0")}</span>
                  <span className="va-countdown-label">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {!data?.dob && (
          <div className="va-countdown-placeholder">
            🎂 Birthday countdown coming soon...
          </div>
        )}
      </div>

      {/* PHOTO GALLERY */}
      <div className="va-section">
        <div className="va-section-header">
          <h2>📸 Memory Wall</h2>
          {data?.photos?.length > 0 && (
            <button className="va-slideshow-btn" onClick={() => { setSlideshow(true); setSlideIndex(0); }}>
              ▶ Slideshow
            </button>
          )}
        </div>

        {data?.photos?.length === 0 ? (
          <div className="va-empty">
            {isAdmin ? "Click '+ Photo' to add memories!" : "Photos coming soon... 📷"}
          </div>
        ) : (
          <div className="va-polaroid-grid">
            {data.photos.map((photo, i) => (
              <div key={photo._id} className="va-polaroid" style={{ transform: `rotate(${(i % 2 === 0 ? 1 : -1) * (Math.random() * 3 + 1)}deg)` }}>
                <div className="va-polaroid-img-wrapper">
                  <img src={photo.url} alt={photo.caption} className="va-polaroid-img" />
                </div>
                <p className="va-polaroid-caption">{photo.caption || "💕"}</p>
                {isAdmin && (
                  <button className="va-polaroid-delete" onClick={() => deletePhoto(photo._id)}>✕</button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MESSAGES SECTION */}
      <div className="va-section">
        <div className="va-section-header">
          <h2>💌 Family Messages</h2>
          <button className="va-msg-btn" onClick={() => setShowMsgForm(true)}>+ Add Message</button>
        </div>

        {data?.messages?.length === 0 ? (
          <div className="va-empty">Be the first to leave a message! 💕</div>
        ) : (
          <div className="va-messages">
            {data.messages.map((msg) => (
              <div key={msg._id} className="va-message-card">
                <div className="va-msg-avatar">{msg.name?.charAt(0).toUpperCase()}</div>
                <div className="va-msg-content">
                  <p className="va-msg-name">{msg.name}</p>
                  <p className="va-msg-text">{msg.message}</p>
                </div>
                {isAdmin && (
                  <button className="va-msg-delete" onClick={() => deleteMessage(msg._id)}>✕</button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FOOTER */}
      <div className="va-footer">
        <p>❤️ Made with love for Vignesh</p>
        <button onClick={() => navigate("/")}>← Back to Home</button>
      </div>

      {/* SLIDESHOW */}
      {slideshow && data?.photos?.length > 0 && (
        <div className="va-slideshow-overlay" onClick={() => setSlideshow(false)}>
          <div className="va-slideshow-content" onClick={e => e.stopPropagation()}>
            <button className="va-slide-close" onClick={() => setSlideshow(false)}>✕</button>
            <button className="va-slide-prev" onClick={() => setSlideIndex(prev => (prev - 1 + data.photos.length) % data.photos.length)}>‹</button>
            <img src={data.photos[slideIndex].url} alt="" className="va-slide-img" />
            <p className="va-slide-caption">{data.photos[slideIndex].caption}</p>
            <div className="va-slide-dots">
              {data.photos.map((_, i) => (
                <div key={i} className={`va-slide-dot ${i === slideIndex ? "active" : ""}`} onClick={() => setSlideIndex(i)} />
              ))}
            </div>
            <button className="va-slide-next" onClick={() => setSlideIndex(prev => (prev + 1) % data.photos.length)}>›</button>
          </div>
        </div>
      )}

      {/* PROFILE FORM */}
      {showProfileForm && (
        <div className="va-overlay" onClick={() => setShowProfileForm(false)}>
          <div className="va-form" onClick={e => e.stopPropagation()}>
            <h3>✏️ Edit Profile</h3>
            <div className="va-field">
              <label>Name</label>
              <input value={profileForm.name} onChange={e => setProfileForm({ ...profileForm, name: e.target.value })} placeholder="Vignesh" />
            </div>
            <div className="va-field">
              <label>Tagline</label>
              <input value={profileForm.tagline} onChange={e => setProfileForm({ ...profileForm, tagline: e.target.value })} placeholder="A short quote or description..." />
            </div>
            <div className="va-field">
              <label>Date of Birth</label>
              <input type="date" value={profileForm.dob} onChange={e => setProfileForm({ ...profileForm, dob: e.target.value })} />
              {profileForm.dob && <span className="va-age-pill">🎂 {calcAge(profileForm.dob)} years old</span>}
            </div>
            <div className="va-field">
              <label>Profile Photo</label>
              <input type="file" accept="image/*" onChange={e => setPhotoFile(e.target.files[0])} />
              {photoFile && <p style={{ color: "#6ee7b7", fontSize: "13px" }}>✅ {photoFile.name} selected</p>}
            </div>
            <div className="va-form-btns">
              <button className="va-btn-save" onClick={saveProfile} disabled={saving}>{saving ? "Saving..." : "Save"}</button>
              <button className="va-btn-cancel" onClick={() => setShowProfileForm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* ADD PHOTO FORM */}
      {showPhotoForm && (
        <div className="va-overlay" onClick={() => setShowPhotoForm(false)}>
          <div className="va-form" onClick={e => e.stopPropagation()}>
            <h3>📸 Add Memory</h3>
            <div className="va-field">
              <label>Photo</label>
              <input type="file" accept="image/*" onChange={e => setPhotoFile(e.target.files[0])} />
              {photoFile && <p style={{ color: "#6ee7b7", fontSize: "13px" }}>✅ {photoFile.name} selected</p>}
            </div>
            <div className="va-field">
              <label>Caption (optional)</label>
              <input value={photoCaption} onChange={e => setPhotoCaption(e.target.value)} placeholder="A sweet memory..." />
            </div>
            <div className="va-form-btns">
              <button className="va-btn-save" onClick={addPhoto} disabled={saving}>{saving ? "Uploading..." : "Add Photo"}</button>
              <button className="va-btn-cancel" onClick={() => setShowPhotoForm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* MESSAGE FORM */}
      {showMsgForm && (
        <div className="va-overlay" onClick={() => setShowMsgForm(false)}>
          <div className="va-form" onClick={e => e.stopPropagation()}>
            <h3>💌 Leave a Message</h3>
            <div className="va-field">
              <label>Your Name</label>
              <input value={msgForm.name} onChange={e => setMsgForm({ ...msgForm, name: e.target.value })} placeholder="Enter your name" />
            </div>
            <div className="va-field">
              <label>Message</label>
              <textarea value={msgForm.message} onChange={e => setMsgForm({ ...msgForm, message: e.target.value })} placeholder="Write something special for Vignesh..." rows={4} />
            </div>
            <div className="va-form-btns">
              <button className="va-btn-save" onClick={addMessage} disabled={saving}>{saving ? "Sending..." : "Send Message"}</button>
              <button className="va-btn-cancel" onClick={() => setShowMsgForm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}