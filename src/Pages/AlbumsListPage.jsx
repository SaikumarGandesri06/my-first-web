

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AlbumsListPage.css";

const API = "https://my-first-web-backend.onrender.com";

const COLORS = [
  "#6366f1","#8b5cf6","#ec4899","#f59e0b",
  "#10b981","#3b82f6","#ef4444","#14b8a6"
];

export default function AlbumsListPage() {
  const navigate = useNavigate();
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);
  const [form, setForm] = useState({
    name: "", tagline: "", dob: "", coverColor: "#6366f1"
  });

  useEffect(() => {
    fetchAlbums();
    if (localStorage.getItem("adminToken")) setIsAdmin(true);
  }, []);

  const fetchAlbums = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/albums`);
      const data = await res.json();
      setAlbums(data);
    } catch (e) { console.log(e); }
    setLoading(false);
  };

  const createAlbum = async () => {
    if (!form.name.trim()) { alert("Please enter a name"); return; }
    setSaving(true);
    const token = localStorage.getItem("adminToken");
    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("tagline", form.tagline);
    fd.append("dob", form.dob);
    fd.append("coverColor", form.coverColor);
    if (photoFile) fd.append("profilePhoto", photoFile);
    try {
      const res = await fetch(`${API}/albums`, {
        method: "POST",
        headers: { authorization: token },
        body: fd
      });
      const data = await res.json();
      if (data.message === "Album already exists") {
        alert("⚠️ Album with this name already exists!");
      } else {
        fetchAlbums();
        setShowForm(false);
        setForm({ name: "", tagline: "", dob: "", coverColor: "#6366f1" });
        setPhotoFile(null);
      }
    } catch (e) { alert("Error creating album"); }
    setSaving(false);
  };

  const deleteAlbum = async (slug) => {
    if (!window.confirm("Delete this album permanently?")) return;
    const token = localStorage.getItem("adminToken");
    await fetch(`${API}/albums/${slug}`, {
      method: "DELETE",
      headers: { authorization: token }
    });
    fetchAlbums();
  };

  const calcAge = (dob) => {
    if (!dob) return null;
    return Math.floor((new Date() - new Date(dob)) / (365.25 * 24 * 60 * 60 * 1000));
  };

  if (loading) return (
    <div className="al-loading">
      <div className="al-spinner"></div>
      <p>Loading Albums...</p>
    </div>
  );

  return (
    <div className="al-page">

      {/* STARS */}
      <div className="al-stars">
        {Array.from({ length: 50 }).map((_, i) => (
          <div key={i} className="al-star" style={{
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
      <div className="al-admin-bar">
        {isAdmin ? (
          <div className="al-admin-controls">
            <span className="al-admin-badge">👑 Admin</span>
            <button className="al-abtn" onClick={() => setShowForm(true)}>+ New Album</button>
            <button className="al-abtn al-abtn-red" onClick={() => { localStorage.removeItem("adminToken"); setIsAdmin(false); }}>Logout</button>
          </div>
        ) : (
          <button className="al-login-btn" onClick={() => navigate("/admin-login")}>🔐 Admin</button>
        )}
      </div>

      {/* HERO */}
      <div className="al-hero">
        <p className="al-hero-sub">✨ Family</p>
        <h1 className="al-hero-title">Personal Albums</h1>
        <p className="al-hero-desc">Special memories for every member of our family</p>
      </div>

      {/* ALBUMS GRID */}
      {albums.length === 0 ? (
        <div className="al-empty">
          {isAdmin ? "Click '+ New Album' to create the first album!" : "No albums yet. Coming soon! 📷"}
        </div>
      ) : (
        <div className="al-grid">
          {albums.map((album, i) => (
            <div
              key={album._id}
              className="al-card"
              onClick={() => navigate(`/albums/${album.slug}`)}
              style={{ "--accent": album.coverColor || COLORS[i % COLORS.length] }}
            >
              <div className="al-card-top">
                <div className="al-card-glow"></div>
                {album.profilePhoto ? (
                  <img src={album.profilePhoto} alt={album.name} className="al-card-photo" />
                ) : (
                  <div className="al-card-avatar" style={{ background: album.coverColor || COLORS[i % COLORS.length] }}>
                    {album.name?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="al-card-body">
                <h3 className="al-card-name">{album.name}</h3>
                {album.dob && (
                  <p className="al-card-age">🎂 {calcAge(album.dob)} years old</p>
                )}
                {album.tagline && (
                  <p className="al-card-tagline">"{album.tagline}"</p>
                )}
                <button className="al-card-btn">View Album →</button>
              </div>
              {isAdmin && (
                <button
                  className="al-card-delete"
                  onClick={e => { e.stopPropagation(); deleteAlbum(album.slug); }}
                >🗑️</button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* FOOTER */}
      <div className="al-footer">
        <p>❤️ Gandesri Family Albums</p>
        <button onClick={() => navigate("/family")}>← Back to Family</button>
      </div>

      {/* CREATE ALBUM FORM */}
      {showForm && (
        <div className="al-overlay" onClick={() => setShowForm(false)}>
          <div className="al-form" onClick={e => e.stopPropagation()}>
            <h3>✨ Create New Album</h3>

            <div className="al-field">
              <label>Person's Name *</label>
              <input
                placeholder="e.g. Vignesh"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div className="al-field">
              <label>Tagline</label>
              <input
                placeholder="A short quote or description..."
                value={form.tagline}
                onChange={e => setForm({ ...form, tagline: e.target.value })}
              />
            </div>

            <div className="al-field">
              <label>Date of Birth</label>
              <input
                type="date"
                value={form.dob}
                onChange={e => setForm({ ...form, dob: e.target.value })}
              />
              {form.dob && (
                <span className="al-age-pill">🎂 {calcAge(form.dob)} years old</span>
              )}
            </div>

            <div className="al-field">
              <label>Theme Color</label>
              <div className="al-colors">
                {COLORS.map(color => (
                  <div
                    key={color}
                    className={`al-color-dot ${form.coverColor === color ? "active" : ""}`}
                    style={{ background: color }}
                    onClick={() => setForm({ ...form, coverColor: color })}
                  />
                ))}
              </div>
            </div>

            <div className="al-field">
              <label>Profile Photo</label>
              <input
                type="file"
                accept="image/*"
                onChange={e => setPhotoFile(e.target.files[0])}
              />
              {photoFile && <p className="al-file-name">✅ {photoFile.name}</p>}
            </div>

            <div className="al-form-btns">
              <button className="al-btn-save" onClick={createAlbum} disabled={saving}>
                {saving ? "Creating..." : "Create Album"}
              </button>
              <button className="al-btn-cancel" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}