import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
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

  const user =
    JSON.parse(localStorage.getItem("excuse_user") || "{}") || {};

  /* ================= API CALLS ================= */

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
    alert("Saved to favorites ⭐");
  };

  const rateExcuse = async () => {
    if (!currentExcuse?._id) return;
    await API.post("/api/excuses/rate", {
      excuseId: currentExcuse._id,
      rating: ratingValue
    });
    fetchBest();
    alert("Rating submitted ✅");
  };

  const sendProofEmail = async () => {
    if (!currentExcuse?._id) return;
    await API.post("/api/excuses/send-proof-email", {
      excuseId: currentExcuse._id
    });
    alert("Proof email sent 📧");
  };

  /* ================= PDF DOWNLOAD ================= */

  const downloadProof = () => {
    const doc = new jsPDF();

    doc.setFont("Times", "Normal");
    doc.setFontSize(14);
    doc.text("WORKPLACE ABSENCE CERTIFICATE", 105, 20, {
      align: "center"
    });

    doc.setFontSize(11);
    doc.text(
      `This document is to formally certify that ${
        user.name || "the individual"
      } was unable to attend professional responsibilities due to genuine and unavoidable circumstances.

${proof}

This certificate is issued in good faith for official verification purposes.

Issued on: ${new Date().toLocaleDateString()}
`,
      20,
      40
    );

    doc.text("Authorized Signatory", 20, 250);
    doc.text("AI Excuse Generator System", 20, 258);

    doc.save("Excuse_Proof.pdf");
  };

  /* ================= LOGOUT ================= */

  const logout = () => {
    localStorage.removeItem("excuse_token");
    localStorage.removeItem("excuse_user");
    window.location.href = "/login";
  };

  useEffect(() => {
    fetchPrediction();
    fetchBest();
  }, []);

  /* ================= UI ================= */

  return (
    <>
      {/* INLINE CSS */}
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
          border: 1px solid rgba(255,255,255,0.12);
          background: transparent;
          color: #e5e7eb;
          cursor: pointer;
        }
        .active {
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
        .hero {
          border: 1px solid rgba(251,191,36,0.4);
        }
        .excuse {
          font-size: 1.25rem;
          margin: 12px 0;
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
        .topbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
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

          <button className="primary" onClick={generateExcuse}>
            {loading ? "Generating..." : "Generate Excuse"}
          </button>
        </aside>

        {/* MAIN */}
        <main className="main">
          <div className="topbar">
            <h2>AI Excuse Generator</h2>
            <button onClick={logout}>🚪 Logout</button>
          </div>

          {currentExcuse && (
            <section className="card hero">
              <h2>🎯 Generated Excuse</h2>
              <p className="excuse">“{currentExcuse.text}”</p>

              <button onClick={markFavorite}>⭐ Save</button>
              <button onClick={downloadProof}>📄 Download Proof</button>
              <button onClick={sendProofEmail}>📧 Email Proof</button>

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
              <pre>
{`Subject: Request for consideration regarding absence

Dear Sir/Madam,

I hope this message finds you well. I regret to inform you that I was unable to attend my duties due to unavoidable personal circumstances.

The situation required my immediate attention and was beyond my control. I sincerely apologize for the inconvenience caused.

I assure you that I will complete all pending responsibilities at the earliest.

Yours sincerely,
${user.name || "Employee"}
`}
              </pre>
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

export default DashboardPage;
