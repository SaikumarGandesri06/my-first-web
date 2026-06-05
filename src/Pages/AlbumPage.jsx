import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./AlbumsListPage.css";

const API = "https://my-first-web-backend.onrender.com";

export default function AlbumPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [slideshow, setSlideshow] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);
  const [countdown, setCountdown] = useState(null);
  const [showMsgForm, setShowMsgForm] = useState(false);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [showPhotoForm, setShowPhotoForm] = useState(false);
  const [msgForm, setMsgForm] = useState({ name: "", message: "" });
  const [profileForm, setProfileForm] = useState({ name: "", tagline: "", dob: "", coverColor: "#6366f1" });
  const [photoCaption, setPhotoCaption] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const COLORS = ["#6366f1","#8b5cf6","#ec4899","#f59e0b","#10b981","#3b82f6","#ef4444","#14b8a6"];

  useEffect(() => {
    fetchAlbum();
    if (localStorage.getItem("adminToken")) setIsAdmin(true);
  }, [slug]);

  useEffect(() => {
    if (!album?.dob) return;
    const calc = () => {
      const today = new Date();
      const dob = new Date(album.dob);
      const next = new Date(today.getFullYear(), dob.getMonth(), dob.getDate());
      if (next < today) next.setFullYear(today.getFullYear() + 1);
      const diff = next - today;
      setCountdown({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        mins: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        secs: Math.floor((diff % (1000 * 60)) / 1000)
      });
    };
    calc();
    const interval = setInterval(calc, 1000);
    return () => clearInterval(interval);
  }, [album?.dob]);

  useEffect(() => {
    if (!slideshow || !album?.photos?.length) return;
    const interval = setInterval(() => {
      setSlideIndex(prev => (prev + 1) % album.photos.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [slideshow, album?.photos?.length]);

  const fetchAlbum = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/albums/${slug}`);
      if (res.status === 404) { navigate("/albums"); return; }
      const data = await res.json();
      setAlbum(data);
      setProfileForm({ name: data.name, tagline: data.tagline || "", dob: data.dob || "", coverColor: data.coverColor || "#6366f1" });
    } catch (e) { console.log(e); }
    setLoading(false);
  };

  const calcAge = (dob) => {
    if (!dob) return null;
    return Math.floor((new Date() - new Date(dob)) / (365.25 * 24 * 60 * 60 * 1000));
  };

  const saveProfile = async () => {
    setSaving(true);
    const token = localStorage.getItem("adminToken");
    const fd = new FormData();
    Object.entries(profileForm).forEach(([k, v]) => fd.append(k, v));
    if (photoFile) fd.append("profilePhoto", photoFile);
    try {
      await fetch(`${API}/albums/${slug}/profile`, {
        method: "PUT",
        headers: { authorization: token },
        body: fd
      });
      fetchAlbum();
      setShowProfileForm(false);
      setPhotoFile(null);
    } catch (e) { alert("Error saving"); }
    setSaving(false);
  };

  const addPhoto = async () => {
    if (!photoFile) { alert("Please select a photo"); return; }
    setSaving(true);
    const token = localStorage.getItem("adminToken");
    const fd = new FormData();
    fd.append("image", photoFile);
    fd.append("caption", photoCaption);
    try {
      await fetch(`${API}/albums/${slug}/photos`, {
        method: "POST",
        headers: { authorization: token },
        body: fd
      });
      fetchAlbum();
      setShowPhotoForm(false);
      setPhotoFile(null);
      setPhotoCaption("");
    } catch (e) { alert("Error adding photo"); }
    setSaving(false);
  };

  const deletePhoto = async (photoId) => {
    if (!window.confirm("Delete this photo?")) return;
    const token = localStorage.getItem("adminToken");
    await fetch(`${API}/albums/${slug}/photos/${photoId}`, {
      method: "DELETE",
      headers: { authorization: token }
    });
    fetchAlbum();
  };

  const addMessage = async () => {
    if (!msgForm.name || !msgForm.message) { alert("Please fill all fields"); return; }
    setSaving(true);
    try {
      await fetch(`${API}/albums/${slug}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(msgForm)
      });
      fetchAlbum();
      setShowMsgForm(false);
      setMsgForm({ name: "", message: "" });
    } catch (e) { alert("Error sending message"); }
    setSaving(false);
  };

  const deleteMessage = async (msgId) => {
    const token = localStorage.getItem("adminToken");
    await fetch(`${API}/albums/${slug}/messages/${msgId}`, {
      method: "DELETE",
      headers: { authorization: token }
    });
    fetchAlbum();
  };

  if (loading) return (
    <div className="ap-loading">
      <div className="ap-spinner"></div>
      <p>Loading Album...</p>
    </div>
  );

  const accent = album?.coverColor || "#6366f1";

  return (
    <div className="ap-page" style={{ "--accent": accent }}>

      {/* STARS */}
      <div className="ap-stars">
        {Array.from({ length: 60 }).map((_, i) => (
          <div key={i} className="ap-star" style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: Math.random() * 2.5 + 1,
            height: Math.random() * 2.5 + 1,
            animationDuration: `${Math.random() * 3 + 2}s`,
            animationDelay: `${Math.random() * 5}s`
          }} />
        ))}
      </div>

      {/* ADMIN BAR */}
      <div className="ap-admin-bar">
        {isAdmin ? (
          <div className="ap-admin-controls">
            <span className="ap-admin-badge">👑</span>
            <button className="ap-abtn" onClick={() => setShowProfileForm(true)}>✏️ Edit</button>
            <button className="ap-abtn ap-abtn-green" onClick={() => setShowPhotoForm(true)}>+ Photo</button>
            <button className="ap-abtn ap-abtn-red" onClick={() => { localStorage.removeItem("adminToken"); setIsAdmin(false); }}>Logout</button>
          </div>
        ) : (
          <button className="ap-login-btn" onClick={() => navigate("/admin-login")}>🔐 Admin</button>
        )}
      </div>

      {/* BACK */}
      <button className="ap-back" onClick={() => navigate("/albums")}>← Albums</button>

      {/* HERO */}
      <div className="ap-hero">
        <div className="ap-hero-glow" style={{ background: `radial-gradient(circle, ${accent}30, transparent 70%)` }}></div>
        <div className="ap-profile-ring" style={{ background: `linear-gradient(135deg, ${accent}, #c084fc, #f472b6)` }}>
          <img
            src={album.profilePhoto || `https://ui-avatars.com/api/?name=${album.name}&background=${accent.replace("#","")}&color=fff&size=400`}
            alt={album.name}
            className="ap-profile-photo"
          />
        </div>
        <p className="ap-hero-sub">✨ Personal Album</p>
        <h1 className="ap-hero-name" style={{ background: `linear-gradient(to right, #60a5fa, ${accent}, #f472b6)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          {album.name}
        </h1>
        {album.dob && <p className="ap-hero-age">🎂 {calcAge(album.dob)} years old</p>}
        {album.tagline && <p className="ap-hero-tagline">"{album.tagline}"</p>}

        {/* COUNTDOWN */}
        {countdown ? (
          <div className="ap-countdown">
            <p className="ap-countdown-title">🎉 Next Birthday In</p>
            <div className="ap-countdown-boxes">
              {[
                { val: countdown.days, label: "Days" },
                { val: countdown.hours, label: "Hours" },
                { val: countdown.mins, label: "Mins" },
                { val: countdown.secs, label: "Secs" }
              ].map((item, i) => (
                <div key={i} className="ap-countdown-box">
                  <span className="ap-countdown-num">{String(item.val).padStart(2, "0")}</span>
                  <span className="ap-countdown-label">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="ap-countdown-placeholder">🎂 Birthday countdown coming soon...</div>
        )}
      </div>

      {/* PHOTOS */}
      <div className="ap-section">
        <div className="ap-section-header">
          <h2>📸 Memory Wall</h2>
          {album.photos?.length > 0 && (
            <button className="ap-slideshow-btn" style={{ background: `linear-gradient(135deg, ${accent}, #8b5cf6)` }} onClick={() => { setSlideshow(true); setSlideIndex(0); }}>
              ▶ Slideshow
            </button>
          )}
        </div>
        {album.photos?.length === 0 ? (
          <div className="ap-empty">{isAdmin ? "Click '+ Photo' to add memories!" : "Photos coming soon... 📷"}</div>
        ) : (
          <div className="ap-polaroid-grid">
            {album.photos.map((photo, i) => (
              <div key={photo._id} className="ap-polaroid" style={{ transform: `rotate(${(i % 2 === 0 ? 1 : -1) * (1 + (i % 3))}deg)` }}>
                <div className="ap-polaroid-img-wrapper">
                  <img src={photo.url} alt={photo.caption} className="ap-polaroid-img" />
                </div>
                <p className="ap-polaroid-caption">{photo.caption || "💕"}</p>
                {isAdmin && (
                  <button className="ap-polaroid-delete" onClick={() => deletePhoto(photo._id)}>✕</button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MESSAGES */}
      <div className="ap-section">
        <div className="ap-section-header">
          <h2>💌 Messages</h2>
          <button className="ap-msg-btn" onClick={() => setShowMsgForm(true)}>+ Leave Message</button>
        </div>
        {album.messages?.length === 0 ? (
          <div className="ap-empty">Be the first to leave a message! 💕</div>
        ) : (
          <div className="ap-messages">
            {album.messages.map((msg) => (
              <div key={msg._id} className="ap-message-card">
                <div className="ap-msg-avatar" style={{ background: `linear-gradient(135deg, ${accent}, #c084fc)` }}>
                  {msg.name?.charAt(0).toUpperCase()}
                </div>
                <div className="ap-msg-content">
                  <p className="ap-msg-name">{msg.name}</p>
                  <p className="ap-msg-text">{msg.message}</p>
                </div>
                {isAdmin && (
                  <button className="ap-msg-delete" onClick={() => deleteMessage(msg._id)}>✕</button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FOOTER */}
      <div className="ap-footer">
        <p>❤️ Gandesri Family</p>
        <button onClick={() => navigate("/albums")}>← Back to Albums</button>
      </div>

      {/* SLIDESHOW */}
      {slideshow && album.photos?.length > 0 && (
        <div className="ap-slideshow-overlay" onClick={() => setSlideshow(false)}>
          <div className="ap-slideshow-content" onClick={e => e.stopPropagation()}>
            <button className="ap-slide-close" onClick={() => setSlideshow(false)}>✕</button>
            <button className="ap-slide-prev" onClick={() => setSlideIndex(p => (p - 1 + album.photos.length) % album.photos.length)}>‹</button>
            <img src={album.photos[slideIndex].url} alt="" className="ap-slide-img" />
            <p className="ap-slide-caption">{album.photos[slideIndex].caption}</p>
            <div className="ap-slide-dots">
              {album.photos.map((_, i) => (
                <div key={i} className={`ap-slide-dot ${i === slideIndex ? "active" : ""}`} onClick={() => setSlideIndex(i)} />
              ))}
            </div>
            <button className="ap-slide-next" onClick={() => setSlideIndex(p => (p + 1) % album.photos.length)}>›</button>
          </div>
        </div>
      )}

      {/* PROFILE FORM */}
      {showProfileForm && (
        <div className="ap-overlay" onClick={() => setShowProfileForm(false)}>
          <div className="ap-form" onClick={e => e.stopPropagation()}>
            <h3>✏️ Edit Profile</h3>
            {[
              { label: "Name", key: "name", type: "text", placeholder: "Name" },
              { label: "Tagline", key: "tagline", type: "text", placeholder: "Short quote..." },
            ].map(f => (
              <div className="ap-field" key={f.key}>
                <label>{f.label}</label>
                <input type={f.type} placeholder={f.placeholder} value={profileForm[f.key]} onChange={e => setProfileForm({ ...profileForm, [f.key]: e.target.value })} />
              </div>
            ))}
            <div className="ap-field">
              <label>Date of Birth</label>
              <input type="date" value={profileForm.dob} onChange={e => setProfileForm({ ...profileForm, dob: e.target.value })} />
              {profileForm.dob && <span className="ap-age-pill">🎂 {calcAge(profileForm.dob)} yrs</span>}
            </div>
            <div className="ap-field">
              <label>Theme Color</label>
              <div className="ap-colors">
                {COLORS.map(color => (
                  <div key={color} className={`ap-color-dot ${profileForm.coverColor === color ? "active" : ""}`} style={{ background: color }} onClick={() => setProfileForm({ ...profileForm, coverColor: color })} />
                ))}
              </div>
            </div>
            <div className="ap-field">
              <label>Profile Photo</label>
              <input type="file" accept="image/*" onChange={e => setPhotoFile(e.target.files[0])} />
              {photoFile && <p className="ap-file-name">✅ {photoFile.name}</p>}
            </div>
            <div className="ap-form-btns">
              <button className="ap-btn-save" onClick={saveProfile} disabled={saving}>{saving ? "Saving..." : "Save"}</button>
              <button className="ap-btn-cancel" onClick={() => setShowProfileForm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* ADD PHOTO FORM */}
      {showPhotoForm && (
        <div className="ap-overlay" onClick={() => setShowPhotoForm(false)}>
          <div className="ap-form" onClick={e => e.stopPropagation()}>
            <h3>📸 Add Memory</h3>
            <div className="ap-field">
              <label>Photo</label>
              <input type="file" accept="image/*" onChange={e => setPhotoFile(e.target.files[0])} />
              {photoFile && <p className="ap-file-name">✅ {photoFile.name}</p>}
            </div>
            <div className="ap-field">
              <label>Caption (optional)</label>
              <input placeholder="A sweet memory..." value={photoCaption} onChange={e => setPhotoCaption(e.target.value)} />
            </div>
            <div className="ap-form-btns">
              <button className="ap-btn-save" onClick={addPhoto} disabled={saving}>{saving ? "Uploading..." : "Add Photo"}</button>
              <button className="ap-btn-cancel" onClick={() => setShowPhotoForm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* MESSAGE FORM */}
      {showMsgForm && (
        <div className="ap-overlay" onClick={() => setShowMsgForm(false)}>
          <div className="ap-form" onClick={e => e.stopPropagation()}>
            <h3>💌 Leave a Message</h3>
            <div className="ap-field">
              <label>Your Name</label>
              <input placeholder="Enter your name" value={msgForm.name} onChange={e => setMsgForm({ ...msgForm, name: e.target.value })} />
            </div>
            <div className="ap-field">
              <label>Message</label>
              <textarea placeholder={`Write something special for ${album.name}...`} value={msgForm.message} onChange={e => setMsgForm({ ...msgForm, message: e.target.value })} rows={4} />
            </div>
            <div className="ap-form-btns">
              <button className="ap-btn-save" onClick={addMessage} disabled={saving}>{saving ? "Sending..." : "Send 💌"}</button>
              <button className="ap-btn-cancel" onClick={() => setShowMsgForm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}