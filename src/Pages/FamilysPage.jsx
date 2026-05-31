import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./FamilysPage.css";

const API = "https://my-first-web-backend.onrender.com";

export default function FamilysPage() {
  const [members, setMembers] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
  name: "",
  type: "brother",
  description: "",
  familyTree: "",
  dob: "",      // ← add this
  age: ""       // ← add this
});
  const navigate = useNavigate();

  useEffect(() => {
    fetchMembers();
    const token = localStorage.getItem("adminToken");
    if (token) setIsAdmin(true);
  }, []);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/family`);
      const data = await res.json();
      setMembers(data);
    } catch (error) {
      console.log("Error fetching members", error);
    }
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setIsAdmin(false);
  };

  const handleEdit = (member) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      type: member.type,
      description: member.description,
      familyTree: member.familyTree
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this member?")) return;
    const token = localStorage.getItem("adminToken");
    try {
      await fetch(`${API}/family/${id}`, {
        method: "DELETE",
        headers: { authorization: token }
      });
      fetchMembers();
    } catch (error) {
      console.log("Error deleting member", error);
    }
  };

  const handleSave = async () => {
    if (!formData.name) {
      alert("Please enter a name");
      return;
    }
    setSaving(true);
    const token = localStorage.getItem("adminToken");
    const data = new FormData();
    data.append("name", formData.name);
    data.append("type", formData.type);
    data.append("description", formData.description);
    data.append("familyTree", formData.familyTree);
    if (imageFile) data.append("image", imageFile);

    const url = editingMember
      ? `${API}/family/${editingMember._id}`
      : `${API}/family`;
    const method = editingMember ? "PUT" : "POST";

    try {
      await fetch(url, {
        method,
        headers: { authorization: token },
        body: data
      });
      setShowForm(false);
      setEditingMember(null);
      setImageFile(null);
      setFormData({ name: "", type: "brother", description: "", familyTree: "" });
      fetchMembers();
    } catch (error) {
      console.log("Error saving member", error);
    }
    setSaving(false);
  };

  const brothers = members.filter((m) => m.type === "brother");
  const sisters = members.filter((m) => m.type === "sister");

  return (
    <div className="family-page">

      {/* BACKGROUND */}
      <div className="bg-circle bg-1"></div>
      <div className="bg-circle bg-2"></div>

      {/* ADMIN BAR */}
      <div className="admin-bar">
        {isAdmin ? (
          <div className="admin-controls">
            <span className="admin-badge">👑 Admin Mode</span>
            <button
              className="add-btn"
              onClick={() => {
                setEditingMember(null);
                setFormData({ name: "", type: "brother", description: "", familyTree: "" });
                setShowForm(true);
              }}
            >
              + Add Member
            </button>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        ) : (
          <button
            className="admin-login-btn"
            onClick={() => navigate("/admin-login")}
          >
            🔐 Admin
          </button>
        )}
      </div>

      {/* ADMIN FORM */}
      {isAdmin && showForm && (
        <div className="form-overlay">
          <div className="admin-form">
            <h3>{editingMember ? "✏️ Edit Member" : "➕ Add New Member"}</h3>

            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                placeholder="Enter full name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <option value="brother">Brother</option>
                <option value="sister">Sister</option>
              </select>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                placeholder="Write about this family member..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="form-group">
              <label>Family Tree Info</label>
              <textarea
                placeholder="Children, spouse, family details..."
                value={formData.familyTree}
                onChange={(e) => setFormData({ ...formData, familyTree: e.target.value })}
                rows={3}
              />
            </div>

            <div className="form-group">
              <label>Photo</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
              />
            </div>
            {/* DATE OF BIRTH + AUTO AGE CALCULATOR */}
<div className="form-group">
  <label>Date of Birth</label>
  <div className="dob-wrapper">
    <input
      type="date"
      value={formData.dob}
      onChange={(e) => {
        const dob = e.target.value;
        const age = dob
          ? Math.floor(
              (new Date() - new Date(dob)) /
              (365.25 * 24 * 60 * 60 * 1000)
            )
          : "";
        setFormData({ ...formData, dob, age });
      }}
    />
    {formData.age !== "" && (
      <div className="age-badge">
        🎂 {formData.age} years old
      </div>
    )}
  </div>
</div>

            <div className="form-buttons">
              <button className="save-btn" onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "Save Member"}
              </button>
              <button
                className="cancel-btn"
                onClick={() => {
                  setShowForm(false);
                  setEditingMember(null);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HERO */}
      <div className="hero-section">
        <div className="hero-badge">🏠 Our Family</div>
        <h1>Gandesri Family</h1>
        <p>Beautiful Memories & Precious Connections</p>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading family members...</p>
        </div>
      )}

      {/* BROTHERS */}
      {!loading && (
        <section className="section">
          <h2 className="section-title">
            <span>Brothers</span>
          </h2>

          {brothers.length === 0 ? (
            <p className="empty-text">No brothers added yet.</p>
          ) : (
            <div className="card-grid">
              {brothers.map((member) => (
                <div className="family-card" key={member._id}>
                  <div className="card-image-wrapper">
                    <img
                      src={member.image || "https://ui-avatars.com/api/?name=" + member.name + "&background=6366f1&color=fff&size=400"}
                      alt={member.name}
                    />
                    <div className="card-overlay">
                      <button
                        className="view-btn"
                        onClick={() => navigate(`/family/${member._id}`)}
                      >
                        View More
                      </button>
                    </div>
                  </div>
                  <div className="card-content">
                    <h3>{member.name}</h3>
                    <p>{member.description?.slice(0, 80)}...</p>
                    <div className="card-actions">
                      <button
                        className="view-more-btn"
                        onClick={() => navigate(`/family/${member._id}`)}
                      >
                        View More →
                      </button>
                      {isAdmin && (
                        <div className="admin-actions">
                          <button
                            className="edit-btn"
                            onClick={() => handleEdit(member)}
                          >
                            ✏️ Edit
                          </button>
                          <button
                            className="delete-btn"
                            onClick={() => handleDelete(member._id)}
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* SISTERS */}
      {!loading && (
        <section className="section">
          <h2 className="section-title">
            <span>Sisters</span>
          </h2>

          {sisters.length === 0 ? (
            <p className="empty-text">No sisters added yet.</p>
          ) : (
            <div className="card-grid">
              {sisters.map((member) => (
                <div className="family-card" key={member._id}>
                  <div className="card-image-wrapper">
                    <img
                      src={member.image || "https://ui-avatars.com/api/?name=" + member.name + "&background=8b5cf6&color=fff&size=400"}
                      alt={member.name}
                    />
                    <div className="card-overlay">
                      <button
                        className="view-btn"
                        onClick={() => navigate(`/family/${member._id}`)}
                      >
                        View More
                      </button>
                    </div>
                  </div>
                  <div className="card-content">
                    <h3>{member.name}</h3>
                    <p>{member.description?.slice(0, 80)}...</p>
                    <div className="card-actions">
                      <button
                        className="view-more-btn"
                        onClick={() => navigate(`/family/${member._id}`)}
                      >
                        View More →
                      </button>
                      {isAdmin && (
                        <div className="admin-actions">
                          <button
                            className="edit-btn"
                            onClick={() => handleEdit(member)}
                          >
                            ✏️ Edit
                          </button>
                          <button
                            className="delete-btn"
                            onClick={() => handleDelete(member._id)}
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* FOOTER */}
      <div className="family-footer">
        <p>❤️ Gandesri Family — Made with Love</p>
      </div>
    </div>
  );
}