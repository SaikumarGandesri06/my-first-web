import React, { useState } from "react";
import ReactQuill from "react-quill";

import "react-quill/dist/quill.snow.css";

function Notes() {

  const [value, setValue] = useState("");
  const saveNote = async () => {

  await fetch("http://localhost:5000/notes", {

    method: "POST",

    headers: {
      "Content-Type": "application/json"
    },

    body: JSON.stringify({
      title: "My Note",
      content: value
    })

  });

};

  return (
    <div>

      <h1 >My Notes</h1>

      <ReactQuill
        theme="snow"
        value={value}
        onChange={setValue}
      />
<button onClick={saveNote}>
  Save Note
</button>
    </div>
  );
}

export default Notes;