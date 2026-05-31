import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const API = "https://my-first-web-backend.onrender.com";

function Notes() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState(null);

  // FETCH NOTES
  const fetchNotes = async () => {
    try {
      const response = await fetch(`${API}/notes`);
      const data = await response.json();
      setNotes(data);
    } catch(error) {
      console.log(error);
    }
  };

  // LOAD NOTES
  useEffect(() => {
    fetchNotes();
  }, []);

  // SAVE OR UPDATE NOTE
  const saveNote = async () => {
    try {
      if(editingId) {
        await fetch(`${API}/notes/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, content })
        });
        setEditingId(null);
      } else {
        await fetch(`${API}/notes`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, content })
        });
      }
      setTitle("");
      setContent("");
      fetchNotes();
    } catch(error) {
      console.log(error);
    }
  };

  // DELETE NOTE
  const deleteNote = async (id) => {
    try {
      await fetch(`${API}/notes/${id}`, {
        method: "DELETE"
      });
      fetchNotes();
    } catch(error) {
      console.log(error);
    }
  };

  // EDIT NOTE
  const editNote = (note) => {
    setTitle(note.title);
    setContent(note.content);
    setEditingId(note._id);
  };

  return (
    <div className="notes-container">
      <h1 className="notes-title">Smart Notes</h1>

      <div className="notes-editor">
        <input
          type="text"
          placeholder="Enter Note Title"
          className="notes-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <ReactQuill
          theme="snow"
          value={content}
          onChange={setContent}
          className="quill-editor"
        />
        <button className="save-note-btn" onClick={saveNote}>
          {editingId ? "Update Note" : "Save Note"}
        </button>
      </div>

      <div className="notes-list">
        {notes.map((note) => (
          <div className="note-card" key={note._id}>
            <h2>{note.title}</h2>
            <div dangerouslySetInnerHTML={{ __html: note.content }} />
            <div className="note-buttons">
              <button className="edit-note-btn" onClick={() => editNote(note)}>
                Edit
              </button>
              <button className="delete-note-btn" onClick={() => deleteNote(note._id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Notes;
