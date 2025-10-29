import { useState } from "react";
import "./../style/VeilingDashboard.css"; 
import VeilingKlok from "../components/VeilingKlok.jsx";

export default function VeilingDashboard() {
  const [auctions, setAuctions] = useState([
    { id: 1, title: "Gouden Tulp • 30 stelen", seller: "WillemDeKweker", desc: "Een Willie klassieker.", prijs: "$30" },
    { id: 2, title: "Boeket Rozen • 50 stelen", seller: "John Barbeque", desc: "Een boeket voor de ware liefde ;).", prijs: "$25" },
    { id: 3, title: "Zonnebloemen", seller: "GreenHouse", desc: "Warme ochtend!", prijs: "$10" },
    { id: 4, title: "Plukker 1850 Lily", seller: "Luxury PotWorth", desc: "Een overprijzig plant dat dood gaat na 1 week..", prijs: "$200" },
  ]);

  const [selected, setSelected] = useState(null);

  const sortPrice = () => {
    const sorted = [...auctions].sort((a, b) => {
      const priceA = parseFloat(String(a.prijs).replace("$", ""));
      const priceB = parseFloat(String(b.prijs).replace("$", ""));
      return priceA - priceB;
    });
    setAuctions(sorted);
  };

  return (
    <div className="container">
      <header className="header">
        <div className="brand">Lopende veilingen</div>
      </header>

      <section className="panel">
        <div className="toolbar">
          <span className="chip">Zoeken...</span>
          <span className="chip">Categorie</span>
          <span className="chip" onClick={sortPrice}>Prijs</span>
        </div>

        <div className="grid">
          {auctions.map((p) => (
            <div key={p.id} className="card" onClick={() => setSelected(p)}>
              <div className="thumb">Afbeelding</div>
              <div className="card-body">
                <div className="title">{p.title}</div>
                <div className="muted">Verkoper: {p.seller}</div>
                <div className="muted">{p.desc}</div>
                <div className="price fw-bold mt-2">{p.prijs}</div>
                <div className="d-flex justify-content-center mt-3">
                    <VeilingKlok price={p.prijs} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
