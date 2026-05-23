import React from "react";
import "./VigneshAlbum.css";

const images = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
    title: "Beach View",
    about: "Beautiful beach memory",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    title: "Nature",
    about: "Amazing natural view",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1493246507139-91e8fad9978e",
    title: "Travel",
    about: "Travel memories",
  },
  {
    id: 4,
    image:
      "https://images.unsplash.com/photo-1519125323398-675f0ddb6308",
    title: "Friends",
    about: "Happy moments",
  },
  {
    id: 5,
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
    title: "Sunset",
    about: "Golden evening",
  },
  {
    id: 6,
    image:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9",
    title: "Smile",
    about: "Beautiful smile",
  },
  {
    id: 7,
    image:
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e",
    title: "Portrait",
    about: "Classic portrait",
  },
  {
    id: 8,
    image:
      "https://images.unsplash.com/photo-1470770841072-f978cf4d019e",
    title: "Mountains",
    about: "Adventure trip",
  },
];

function VigneshAlbum() {
  return (
    <div className="album-container">

      <h1 className="album-title">
        VIGNESH ALBUM
      </h1>

      <div className="gallery">

        {images.map((item) => (
          <div className="card" key={item.id}>

            <img
              src={item.image}
              alt={item.title}
              className="card-image"
            />

            <div className="card-content">

              <h2>{item.title}</h2>

              <p>{item.about}</p>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}

export default VigneshAlbum;