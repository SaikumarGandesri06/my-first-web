import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./MemberDetailPage.css";

const API = "https://my-first-web-backend.onrender.com";

export default function MemberDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  // TREE STATE
  const [nodes, setNodes] = useState([]);
  const [connections, setConnections] = useState([]);
  const [connectMode, setConnectMode] = useState(false);
  const [connectSource, setConnectSource] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [draggingNode, setDraggingNode] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [showNodeForm, setShowNodeForm] = useState(false);
  const [treeSaving, setTreeSaving] = useState(false);
  const [nodeForm, setNodeForm] = useState({
    name: "", age: "", dob: "", relationship: "", photo: ""
  });

  const relationships = [
    "Father", "Mother", "Son", "Daughter",
    "Grandfather", "Grandmother", "Brother",
    "Sister", "Uncle", "Aunt", "Spouse", "Cousin"
  ];

  const avatarColors = [
    "#6366f1", "#8b5cf6", "#ec4899", "#f59e0b",
    "#10b981", "#3b82f6", "#ef4444", "#14b8a6"
  ];

  useEffect(() => {
    fetchMember();
    const token = localStorage.getItem("adminToken");
    if (token) setIsAdmin(true);
  }, [id]);

  const fetchMember = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/family/${id}`);
      const data = await res.json();
      setMember(data);
      if (data.treeNodes) setNodes(data.treeNodes);
      if (data.treeConnections) setConnections(data.treeConnections);
    } catch (error) {
      console.log("Error fetching member", error);
    }
    setLoading(false);
  };

  // DRAG HANDLERS
  const startDrag = (e, nodeId) => {
    if (connectMode) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const node = nodes.find(n => n.nodeId === nodeId);
    setDraggingNode(nodeId);
    setDragOffset({
      x: e.clientX - rect.left - node.x,
      y: e.clientY - rect.top - node.y
    });
  };

  const onMouseMove = (e) => {
    if (!draggingNode) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width - 120, e.clientX - rect.left - dragOffset.x));
    const y = Math.max(0, Math.min(rect.height - 100, e.clientY - rect.top - dragOffset.y));
    setNodes(prev => prev.map(n =>
      n.nodeId === draggingNode ? { ...n, x, y } : n
    ));
  };

  const onMouseUp = () => setDraggingNode(null);

  // CONNECT HANDLER
  const handleNodeClick = (nodeId) => {
    if (!connectMode) return;
    if (!connectSource) {
      setConnectSource(nodeId);
    } else {
      if (connectSource !== nodeId) {
        const exists = connections.some(c =>
          (c.from === connectSource && c.to === nodeId) ||
          (c.from === nodeId && c.to === connectSource)
        );
        if (!exists) {
          setConnections(prev => [...prev, { from: connectSource, to: nodeId }]);
        }
      }
      setConnectSource(null);
      setConnectMode(false);
    }
  };

  // ADD NODE
  const addNode = () => {
    setSelectedNode(null);
    setNodeForm({ name: "", age: "", dob: "", relationship: "Son", photo: "" });
    setShowNodeForm(true);
  };

  // EDIT NODE
  const editNode = (node) => {
    setSelectedNode(node.nodeId);
    setNodeForm({
      name: node.name,
      age: node.age,
      dob: node.dob || "",
      relationship: node.relationship,
      photo: node.photo || ""
    });
    setShowNodeForm(true);
  };

  // SAVE NODE FORM
  const saveNodeForm = () => {
    if (!nodeForm.name) return;
    if (selectedNode) {
      setNodes(prev => prev.map(n =>
        n.nodeId === selectedNode ? { ...n, ...nodeForm } : n
      ));
    } else {
      const newNode = {
        nodeId: "node_" + Date.now(),
        name: nodeForm.name,
        age: nodeForm.age,
        dob: nodeForm.dob,
        relationship: nodeForm.relationship,
        photo: nodeForm.photo,
        x: 100 + Math.random() * 300,
        y: 100 + Math.random() * 200
      };
      setNodes(prev => [...prev, newNode]);
    }
    setShowNodeForm(false);
    setSelectedNode(null);
  };

  // DELETE NODE
  const deleteNode = (nodeId) => {
    setNodes(prev => prev.filter(n => n.nodeId !== nodeId));
    setConnections(prev => prev.filter(c => c.from !== nodeId && c.to !== nodeId));
    setShowNodeForm(false);
  };

  // SAVE TREE TO MONGODB
  const saveTree = async () => {
    setTreeSaving(true);
    const token = localStorage.getItem("adminToken");
    try {
      await fetch(`${API}/family/${id}/tree`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: token
        },
        body: JSON.stringify({ treeNodes: nodes, treeConnections: connections })
      });
      alert("✅ Family tree saved!");
    } catch (error) {
      alert("❌ Error saving tree");
    }
    setTreeSaving(false);
  };

  // GET NODE CENTER
  const getCenter = (nodeId) => {
    const n = nodes.find(x => x.nodeId === nodeId);
    if (!n) return null;
    return { x: n.x + 60, y: n.y + 55 };
  };

  // AUTO CALCULATE AGE FROM DOB
  const calcAge = (dob) => {
    if (!dob) return "";
    return Math.floor((new Date() - new Date(dob)) / (365.25 * 24 * 60 * 60 * 1000));
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
          {member.dob && (
            <div className="detail-age-badge">
              🎂 {calcAge(member.dob)} years old
            </div>
          )}
          <p className="detail-description">{member.description}</p>
        </div>
      </div>

      {/* ─── FAMILY TREE SECTION ─── */}
      <section className="detail-section">
        <div className="section-header">
          <span className="section-icon">🌳</span>
          <h2>Family Tree</h2>
          {isAdmin && (
            <div className="tree-admin-btns">
              <button className="tree-btn add" onClick={addNode}>+ Add Person</button>
              <button
                className={`tree-btn connect ${connectMode ? "active" : ""}`}
                onClick={() => { setConnectMode(!connectMode); setConnectSource(null); }}
              >
                {connectMode ? "🔗 Click 2nd Person..." : "🔗 Connect"}
              </button>
              <button
                className="tree-btn clear"
                onClick={() => setConnections([])}
              >
                Clear Lines
              </button>
              <button
                className="tree-btn save"
                onClick={saveTree}
                disabled={treeSaving}
              >
                {treeSaving ? "Saving..." : "💾 Save Tree"}
              </button>
            </div>
          )}
        </div>

        {/* CONNECT MODE HINT */}
        {connectMode && (
          <div className="connect-hint">
            {connectSource
              ? "✅ Now click the second person to connect"
              : "👆 Click the first person to connect"}
          </div>
        )}

        {/* TREE CANVAS */}
        <div
          className="tree-canvas"
          ref={canvasRef}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
        >
          {/* SVG CONNECTIONS */}
          <svg className="tree-svg">
            <defs>
              <marker id="dot" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5">
                <circle cx="5" cy="5" r="3" fill="#6366f1" />
              </marker>
            </defs>
            {connections.map((c, i) => {
              const from = getCenter(c.from);
              const to = getCenter(c.to);
              if (!from || !to) return null;
              const mx = (from.x + to.x) / 2;
              const my = (from.y + to.y) / 2 - 40;
              return (
                <g key={i}>
                  <path
                    d={`M ${from.x} ${from.y} Q ${mx} ${my} ${to.x} ${to.y}`}
                    fill="none"
                    stroke="rgba(99,102,241,0.5)"
                    strokeWidth="2"
                    strokeDasharray="6 3"
                    markerStart="url(#dot)"
                    markerEnd="url(#dot)"
                  />
                </g>
              );
            })}
          </svg>

          {/* NODES */}
          {nodes.map((node, i) => (
            <div
              key={node.nodeId}
              className={`tree-node ${connectSource === node.nodeId ? "connect-source" : ""} ${draggingNode === node.nodeId ? "dragging" : ""}`}
              style={{ left: node.x, top: node.y }}
              onMouseDown={(e) => startDrag(e, node.nodeId)}
              onClick={() => handleNodeClick(node.nodeId)}
            >
              <div className="tree-node-inner">
                {node.photo ? (
                  <img src={node.photo} alt={node.name} className="tree-node-photo" />
                ) : (
                  <div
                    className="tree-node-avatar"
                    style={{ background: avatarColors[i % avatarColors.length] }}
                  >
                    {node.name?.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="tree-node-name">{node.name}</div>
                <div className="tree-node-rel">{node.relationship}</div>
                <div className="tree-node-age">
                  {node.dob ? `${calcAge(node.dob)} yrs` : node.age ? `${node.age} yrs` : ""}
                </div>
                {isAdmin && (
                  <button
                    className="tree-node-edit"
                    onClick={(e) => { e.stopPropagation(); editNode(node); }}
                  >
                    ✏️
                  </button>
                )}
              </div>
            </div>
          ))}

          {/* EMPTY STATE */}
          {nodes.length === 0 && (
            <div className="tree-empty">
              {isAdmin
                ? "Click '+ Add Person' to start building the family tree"
                : "Family tree coming soon..."}
            </div>
          )}
        </div>

        {/* NODE FORM */}
        {isAdmin && showNodeForm && (
          <div className="node-form-overlay">
            <div className="node-form">
              <h3>{selectedNode ? "Edit Person" : "Add Person"}</h3>
              <div className="node-form-grid">
                <div className="nf-group">
                  <label>Full Name</label>
                  <input
                    placeholder="Enter name"
                    value={nodeForm.name}
                    onChange={e => setNodeForm({ ...nodeForm, name: e.target.value })}
                  />
                </div>
                <div className="nf-group">
                  <label>Relationship</label>
                  <select
                    value={nodeForm.relationship}
                    onChange={e => setNodeForm({ ...nodeForm, relationship: e.target.value })}
                  >
                    {relationships.map(r => <option key={r}>{r}</option>)}
                  </select>
                </div>
                <div className="nf-group">
                  <label>Date of Birth</label>
                  <div className="dob-row">
                    <input
                      type="date"
                      value={nodeForm.dob}
                      onChange={e => {
                        const dob = e.target.value;
                        const age = calcAge(dob);
                        setNodeForm({ ...nodeForm, dob, age });
                      }}
                    />
                    {nodeForm.dob && (
                      <span className="age-badge">🎂 {calcAge(nodeForm.dob)} yrs</span>
                    )}
                  </div>
                </div>
                <div className="nf-group">
                  <label>Photo URL (optional)</label>
                  <input
                    placeholder="https://..."
                    value={nodeForm.photo}
                    onChange={e => setNodeForm({ ...nodeForm, photo: e.target.value })}
                  />
                </div>
              </div>
              <div className="node-form-btns">
                <button className="nf-save" onClick={saveNodeForm}>Save</button>
                <button className="nf-cancel" onClick={() => setShowNodeForm(false)}>Cancel</button>
                {selectedNode && (
                  <button className="nf-delete" onClick={() => deleteNode(selectedNode)}>Delete</button>
                )}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* PHOTO GALLERY */}
      {member.photos && member.photos.length > 0 && (
        <section className="detail-section">
          <div className="section-header">
            <span className="section-icon">📸</span>
            <h2>Photo Gallery</h2>
          </div>
          <div className="photo-gallery">
            {member.photos.map((photo, index) => (
              <div className="gallery-item" key={index} onClick={() => setSelectedPhoto(photo)}>
                <img src={photo} alt={`photo-${index}`} />
                <div className="gallery-overlay">🔍</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* LIGHTBOX */}
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