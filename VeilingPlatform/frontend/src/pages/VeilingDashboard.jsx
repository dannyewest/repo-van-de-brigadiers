import { useState } from "react";
import "./../style/VeilingDashboard.css"; 
import { Button } from "react-bootstrap";
import { Clock } from "lucide-react"; // mooi klokicoon (werkt met lucide-react)

export default function VeilingDashboard() {
  const [products, setProducts] = useState([
    { id: 1, title: "Gouden Tulp • 30 stelen", seller: "WillemDeKweker", desc: "Een Willie klassieker.", prijs: "$20" },
    { id: 2, title: "Boeket Rozen • 50 stelen", seller: "John Barbeque", desc: "Een boeket voor de ware liefde ;).", prijs: "$5" },
    { id: 3, title: "Zonnebloemen", seller: "GreenHouse", desc: "Warme ochtend!", prijs: "$80" },
    { id: 4, title: "Plukker 1850 Lily", seller: "Luxury PotWorth", desc: "Een overprijzig plant dat dood gaat na 1 week..", prijs: "$10" },
  ]);

  const [selected, setSelected] = useState(null);

  const sortPrice = () => {
    const sorted = [...products].sort((a, b) => {
      const priceA = parseFloat(String(a.prijs).replace("$", ""));
      const priceB = parseFloat(String(b.prijs).replace("$", ""));
      return priceA - priceB;
    });
    setProducts(sorted);
  };

  return (
    <div className="container">
      <header className="header">
        <div className="brand">Bloemenveiling</div>
      </header>

      <section className="panel">
        <div className="toolbar">
          <span className="chip">Zoeken...</span>
          <span className="chip">Categorie</span>
          <span className="chip" onClick={sortPrice}>Prijs</span>
        </div>

        <div className="grid">
          {products.map((p) => (
            <div key={p.id} className="card" onClick={() => setSelected(p)}>
              <div className="thumb">Afbeelding</div>
              <div className="card-body">
                <div className="title">{p.title}</div>
                <div className="muted">Verkoper: {p.seller}</div>
                <div className="muted">{p.desc}</div>
                <div className="price fw-bold mt-2">{p.prijs}</div>
                <div className="d-flex justify-content-between align-items-center mt-3">
                  <div className="text-muted d-flex align-items-center gap-1">
                    <Clock size={16} />
                    <small>00:45</small> {/* placeholder timer */}
                  </div>
                  <Button
                    variant="outline-success"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      alert(`Bod geplaatst op: ${p.title}`);
                    }}
                  >
                    Bied
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
