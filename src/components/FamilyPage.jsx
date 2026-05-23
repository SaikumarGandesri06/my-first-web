import "./FamilyPage.css";

export default function FamilyPage() {
  const brothers = [
    {
      name: "Big Father Family",
      image:
        "https://drive.google.com/uc?export=view&id=1-9pUjO-bsYWODHtocAx3nIg0EPL-RTeH",
      description:
        "This is my big father family. He is the first among my father's brothers. They have 3 children — 2 boys and 1 girl. All of them are married and happily settled in life.",
    },

    {
      name: "Second Brother",
      image: "",
      description:
        "This is the second brother family information section.",
    },

    {
      name: "Third Brother",
      image: "https://via.placeholder.com/400x300",
      description:
        "This is the third brother family information section.",
    },

    {
      name: "Fourth Brother",
      image: "https://via.placeholder.com/400x300",
      description:
        "This is the fourth brother family information section.",
    },

    {
      name: "Fifth Brother",
      image: "https://via.placeholder.com/400x300",
      description:
        "This is the fifth brother family information section.",
    },
  ];

  const sisters = [
    {
      name: "First Sister",
      image: "https://via.placeholder.com/400x300",
    },

    {
      name: "Second Sister",
      image: "https://via.placeholder.com/400x300",
    },

    {
      name: "Third Sister",
      image: "https://via.placeholder.com/400x300",
    },
  ];

  return (
    <div className="family-page">
      {/* HERO SECTION */}
      <div className="hero-section">
        <h1>Gandesri Family</h1>
        <p>Beautiful Memories & Family Connections</p>
      </div>

      {/* BROTHERS */}
      <section className="section">
        <h2 className="section-title">Brothers</h2>

        <div className="card-grid">
          {brothers.map((brother, index) => (
            <div className="family-card" key={index}>
              <img src={brother.image} alt={brother.name} />

              <div className="card-content">
                <h3>{brother.name}</h3>
                <p>{brother.description}</p>

                <button>View More</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SISTERS */}
      <section className="section">
        <h2 className="section-title">Sisters</h2>

        <div className="card-grid">
          {sisters.map((sister, index) => (
            <div className="family-card" key={index}>
              <img src={sister.image} alt={sister.name} />

              <div className="card-content">
                <h3>{sister.name}</h3>

                <button>View More</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}