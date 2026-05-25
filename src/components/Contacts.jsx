import React, { useEffect, useState } from "react";
import "./Contacts.css";
function Contacts() {
  const [contacts, setContacts] = useState([]);
const [searchTerm, setSearchTerm] = useState("");
const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: ""
  });
const editContact = (contact) => {

  setFormData({
    name: contact.name,
    phone: contact.phone,
    email: contact.email
  });

  setEditingId(contact._id);

};
  // GET CONTACTS
  const fetchContacts = async () => {
    try {
      const response = await fetch("https://my-first-web-backend.onrender.com");

      const data = await response.json();

      setContacts(data);
    } catch (error) {
      console.log("Error fetching contacts", error);
    }
  };

  // LOAD CONTACTS WHEN COMPONENT OPENS
  useEffect(() => {
    fetchContacts();
  }, []);

  // INPUT CHANGE
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // SAVE CONTACT
 const handleSubmit = async (e) => {
  e.preventDefault();

  try {

    if(editingId) {

      await fetch(`https://my-first-web-backend.onrender.com/${editingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      setEditingId(null);

    } else {

      await fetch("https://my-first-web-backend.onrender.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

    }

    setFormData({
      name: "",
      phone: "",
      email: ""
    });

    fetchContacts();

  } catch(error) {

    console.log(error);

  }
};

     
  const deleteContact = async (id) => {

  try {

    await fetch(`https://my-first-web-backend.onrender.com/${id}`, {
      method: "DELETE"
    });

    fetchContacts();

  } catch(error) {

    console.log(error);

  }

};
 return (
    <div className="contacts-container">

      <h1 className="contacts-title">
        Contacts Manager
      </h1>

      <form
        className="contacts-form"
        onSubmit={handleSubmit}
      >

        <input
          type="text"
          name="name"
          placeholder="Enter Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="phone"
          placeholder="Enter Phone"
          value={formData.phone}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Enter Email"
          value={formData.email}
          onChange={handleChange}
        />

        <button type="submit">
          Save Contact
        </button>

      </form>
<input
  type="text"
  placeholder="Search Contacts"
  className="contacts-search"
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
/>
      <div className="contacts-list">

        {
         contacts
.filter((contact) =>
  contact.name
    .toLowerCase()
    .includes(searchTerm.toLowerCase())
)
.map((contact) => (
            <div
              className="contact-card"
              key={contact._id}
            >
              <h3>{contact.name}</h3>
              <p>{contact.phone}</p>
              <p>{contact.email}</p>
              <button
  className="delete-btn"
  onClick={() => deleteContact(contact._id)}
>
  Delete
</button>
<button
  className="edit-btn"
  onClick={() => editContact(contact)}
>
  Edit
</button>
            </div>
          ))
        }

      </div>

    </div>
  );
}

export default Contacts;
