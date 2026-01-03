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
    const { data } = await API.get("/api/excuses/prediction");
    setPrediction(data.message);
  };

  const fetchBest = async () => {
    const { data } = await API.get("/api/excuses/best");
    setBestExcuse(data.message || "");
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
    } finally {
      setLoading(false);
    }
  };

  const markFavorite = async () => {
    if (!currentExcuse?._id) return;
    await API.post("/api/excuses/favorite", {
      excuseId: currentExcuse._id
    });
    alert("Saved to favorites ⭐");
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
    await API.post("/api/excuses/send-proof-email", {
      excuseId: currentExcuse._id
    });
    alert("Proof emailed 📧");
  };

  const downloadProof = () => {
    const blob = new Blob([proof], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "absence-proof.txt";
    a.click();
  };

  const speak = (text, lang) => {
    const msg = new SpeechSynthesisUtterance(text);
    msg.lang = lang;
    speechSynthesis.speak(msg);
  };

  useEffect(() => {
    fetchPrediction();
    fetchBest();
  }, []);

  return (
    <>
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
        .sidebar, .card {
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
          background: transparent;
          border: 1px solid rgba(255,255,255,0.12);
          color: #fff;
          cursor: pointer;
        }
        .active { border-color: #fbbf24; }
        .primary {
          background: linear-gradient(135deg,#fbbf24,#f59e0b);
          color: #000;
          font-weight: 600;
        }
        .hero { border-color: rgba(251,191,36,0.5); }
        .grid {
          display: grid;
          grid-template-columns: repeat(3,1fr);
          gap: 24px;
        }
        pre { white-space: pre-wrap; color: #9ca3af; }
        .actions button { margin-right: 10px; }
        .rating { display: flex; gap: 12px; align-items: center; }
      `}</style>

      <div className="dashboard">
        <aside className="sidebar">
          <h2>⚙ Controls</h2>

          <p>Scenario</p>
          {["Work","School","Social","Family"].map(s => (
            <button key={s} className={scenario===s?"active":""} onClick={()=>setScenario(s)}>{s}</button>
          ))}

          <p>Urgency</p>
          {["Normal","Urgent"].map(u => (
            <button key={u} className={urgency===u?"active":""} onClick={()=>setUrgency(u)}>{u}</button>
          ))}

          <button className="primary" onClick={generateExcuse}>
            {loading ? "Generating..." : "Generate Excuse"}
          </button>
        </aside>

        <main>
          {currentExcuse && (
            <div className="card hero">
              <h2>🎯 Generated Excuse</h2>
              <p>“{currentExcuse.text}”</p>

              <div className="actions">
                <button onClick={markFavorite}>⭐ Save to Favorites</button>
                <button onClick={downloadProof}>⬇ Download Proof</button>
                <button onClick={sendProofEmail}>📧 Email Proof</button>
                <button onClick={()=>speak(currentExcuse.text,"en-US")}>🔊 English</button>
                <button onClick={()=>speak(currentExcuse.text,"hi-IN")}>🔊 Hindi</button>
              </div>

              <div className="rating">
                <input type="range" min="1" max="5" value={ratingValue}
                  onChange={(e)=>setRatingValue(e.target.value)} />
                <span>{ratingValue}/5</span>
                <button onClick={rateExcuse}>Submit</button>
              </div>

              <p>🏆 Best Excuse so far: {bestExcuse}</p>
            </div>
          )}

          <div className="grid">
            <div className="card"><h3>📄 Proof</h3><pre>{proof}</pre></div>
            <div className="card"><h3>🙏 Apology</h3><p>{apology}</p><h4>🔮 Prediction</h4><p>{prediction}</p></div>
            <div className="card"><h3>✉ Communication Templates</h3><p>Email & Formal Letter auto-generated</p></div>
          </div>
        </main>
      </div>
    </>
  );
};

export default DashboardPage;
