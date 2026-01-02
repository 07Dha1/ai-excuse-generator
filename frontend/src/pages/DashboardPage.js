import React, { useEffect, useState } from "react";
import API from "../api";

const DashboardPage = () => {
  const [prediction, setPrediction] = useState("");
  const [bestExcuse, setBestExcuse] = useState("");
  const [currentExcuse, setCurrentExcuse] = useState(null);
  const [proof, setProof] = useState("");
  const [apology, setApology] = useState("");
  const [scenario, setScenario] = useState("Work");
  const [urgency, setUrgency] = useState("Normal");
  const [ratingValue, setRatingValue] = useState(4);
  const [loading, setLoading] = useState(false);

  const fetchPrediction = async () => {
    try {
      const { data } = await API.get("/api/excuses/prediction");
      setPrediction(data.message);
    } catch {}
  };

  const fetchBest = async () => {
    try {
      const { data } = await API.get("/api/excuses/best");
      setBestExcuse(data.message || data.text || "");
    } catch {}
  };

  const generateExcuse = async () => {
    setLoading(true);
    try {
      const { data } = await API.post("/api/excuses/generate", {
        scenario,
        urgency
      });
      setCurrentExcuse(data.excuse);
      setProof(data.proof);
      setApology(data.apology);
      fetchPrediction();
      fetchBest();
    } catch {
      alert("Failed to generate excuse");
    } finally {
      setLoading(false);
    }
  };

  const markFavorite = async () => {
    if (!currentExcuse?._id) return;
    await API.post("/api/excuses/favorite", {
      excuseId: currentExcuse._id,
      favorite: true
    });
  };

  const rateExcuse = async () => {
    if (!currentExcuse?._id) return;
    await API.post("/api/excuses/rate", {
      excuseId: currentExcuse._id,
      rating: ratingValue
    });
    fetchBest();
  };

  const sendProofEmail = async () => {
    if (!currentExcuse?._id) return;
    await API.post("/api/excuses/send-proof-email", {
      excuseId: currentExcuse._id
    });
    alert("Proof email sent");
  };

  useEffect(() => {
    fetchPrediction();
    fetchBest();
  }, []);

  return (
    <>
      {/* INLINE CSS – NO SEPARATE FILE */}
      <style>{`
        body {
          margin: 0;
          background: radial-gradient(circle at top, #111827, #050816);
          color: #e5e7eb;
          font-family: Inter, system-ui, sans-serif;
        }
        .dashboard {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 24px;
          padding: 24px;
          min-height: 100vh;
        }
        .sidebar {
          background: rgba(255,255,255,0.06);
          border-radius: 16px;
          padding: 20px;
          border: 1px solid rgba(255,255,255,0.12);
        }
        .sidebar button {
          width: 100%;
          margin-bottom: 8px;
          padding: 10px;
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.12);
          background: transparent;
          color: #e5e7eb;
          cursor: pointer;
        }
        .sidebar .active {
          border-color: #fbbf24;
        }
        .primary {
          background: linear-gradient(135deg,#fbbf24,#f59e0b);
          color: #000;
          font-weight: 600;
        }
        .main {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .card {
          background: rgba(255,255,255,0.06);
          border-radius: 16px;
          padding: 20px;
          border: 1px solid rgba(255,255,255,0.12);
        }
        .hero {
          border: 1px solid rgba(251,191,36,0.4);
        }
        .excuse {
          font-size: 1.25rem;
          margin: 12px 0;
        }
        .actions button {
          margin-right: 10px;
        }
        .rating {
          display: flex;
          gap: 12px;
          align-items: center;
          margin-top: 12px;
        }
        .grid {
          display: grid;
          grid-template-columns: repeat(3,1fr);
          gap: 24px;
        }
        pre {
          white-space: pre-wrap;
          color: #9ca3af;
        }
      `}</style>

      <div className="dashboard">
        {/* SIDEBAR */}
        <aside className="sidebar">
          <h2>⚙ Controls</h2>

          <p>Scenario</p>
          {["Work", "School", "Social", "Family"].map((s) => (
            <button
              key={s}
              className={scenario === s ? "active" : ""}
              onClick={() => setScenario(s)}
            >
              {s}
            </button>
          ))}

          <p>Urgency</p>
          {["Normal", "Urgent"].map((u) => (
            <button
              key={u}
              className={urgency === u ? "active" : ""}
              onClick={() => setUrgency(u)}
            >
              {u}
            </button>
          ))}

          <button className="primary" onClick={generateExcuse} disabled={loading}>
            {loading ? "Generating..." : "Generate Excuse"}
          </button>
        </aside>

        {/* MAIN */}
        <main className="main">
          {currentExcuse && (
            <section className="card hero">
              <h2>🎯 Generated Excuse</h2>
              <p className="excuse">“{currentExcuse.text}”</p>

              <div className="actions">
                <button onClick={markFavorite}>⭐ Save</button>
                <button onClick={sendProofEmail}>📧 Email Proof</button>
              </div>

              <div className="rating">
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={ratingValue}
                  onChange={(e) => setRatingValue(e.target.value)}
                />
                <span>{ratingValue}/5</span>
                <button onClick={rateExcuse}>Submit</button>
              </div>

              <p>🏆 Best Excuse: {bestExcuse}</p>
            </section>
          )}

          <section className="grid">
            <div className="card">
              <h3>📄 Proof</h3>
              <pre>{proof}</pre>
            </div>

            <div className="card">
              <h3>🙏 Apology</h3>
              <p>{apology}</p>
              <h4>🔮 Prediction</h4>
              <p>{prediction}</p>
            </div>

            <div className="card">
              <h3>✉ Communication Templates</h3>
              <p>Email & Letter auto-generated</p>
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

export default DashboardPage;
