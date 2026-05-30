import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./MemberDetailPage.css";

const API = "https://my-first-web-backend.onrender.com";

export default function MemberDetailPage() {
  const { id } = useParams();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMember();
  }, [id]);

  const fetchMember = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/family/${id}`);
      const data = await res.json();
      setMember(data);
    } catch (error) {
      console.log("Error fetching member", error);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="detail-loading">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="detail-loading">
        <p>Member not found.</p>
        <button onClick={() => navigate("/family")}>← Go Back</button>
      </div>
    );
  }

  return (
    <div className="detail-page">

      {/* BACKGROUND */}
      <div className="detail-bg-1"></div>
      <div className="detail-bg-2"></div>

      {/* BACK BUTTON */}
      <button className="back-button" onClick={() => navigate("/family")}>
        ← Back to Family
      </button>

      {/* HERO SECTION */}
      <div className="detail-hero">
        <div className="detail-image-wrapper">
          <img
            src={member.image || `https://ui-avatars.com/api/?name=${member.name}&background=6366f1&color=fff&size=400`}
            alt={member.name}
            className="detail-main-image"
          />
          <div className="detail-image-glow"></div>
        </div>

        <div className="detail-hero-info">
          <div className="detail-badge">
            {member.type === "brother" ? "👨‍👦 Brother" : "👩‍👧 Sister"}
          </div>
          <h1>{member.name}</h1>
          <p className="detail-description">{member.description}</p>
        </div>
      </div>

      {/* FAMILY TREE SECTION */}
      {member.familyTree && (
        <section className="detail-section">
          <div className="section-header">
            <span className="section-icon">🌳</span>
            <h2>Family Tree</h2>
          </div>
          <div className="family-tree-card">
            <p>{member.familyTree}</p>
          </div>
        </section>
      )}

      {/* PHOTO GALLERY SECTION */}
      {member.photos && member.photos.length > 0 && (
        <section className="detail-section">
          <div className="section-header">
            <span className="section-icon">📸</span>
            <h2>Photo Gallery</h2>
          </div>
          <div className="photo-gallery">
            {member.photos.map((photo, index) => (
              <div
                className="gallery-item"
                key={index}
                onClick={() => setSelectedPhoto(photo)}
              >
                <img src={photo} alt={`photo-${index}`} />
                <div className="gallery-overlay">🔍</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* PHOTO LIGHTBOX */}
      {selectedPhoto && (
        <div className="lightbox" onClick={() => setSelectedPhoto(null)}>
          <div className="lightbox-content">
            <img src={selectedPhoto} alt="full view" />
            <button className="lightbox-close" onClick={() => setSelectedPhoto(null)}>✕</button>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <div className="detail-footer">
        <p>❤️ Gandesri Family</p>
        <button className="back-home-btn" onClick={() => navigate("/family")}>
          ← Back to Family Page
        </button>
      </div>

    </div>
  );
}