import React, { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import API from "../api";
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
  const navigate = useNavigate();

  const [prediction, setPrediction] = useState("");
  const [bestExcuse, setBestExcuse] = useState("");
  const [currentExcuse, setCurrentExcuse] = useState(null);
  const [proof, setProof] = useState("");
  const [apology, setApology] = useState("");
  const [scenario, setScenario] = useState("Work");
  const [urgency, setUrgency] = useState("Normal");
  const [ratingValue, setRatingValue] = useState(4);
  const [loading, setLoading] = useState(false);

  /* ================= API ================= */

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

      setProof(
`WORKPLACE ABSENCE CERTIFICATE

This is to formally certify that the employee was unable to attend official duties due to genuine and unavoidable circumstances.

Reason for Absence:
"${data.excuse.text}"

The situation required immediate personal attention and was beyond the individual's control. This explanation is submitted in good faith and may be treated as an official justification for absence.

The employee remains committed to professional responsibilities and will ensure completion of all pending tasks at the earliest opportunity.

Issued on request for official record.

Date of Issue: ${new Date().toLocaleString()}
Authorized Signature: ______________________
Designation: ______________________`
      );

      setApology(
"I sincerely apologize for the inconvenience caused by my absence. The circumstances were unavoidable, and I assure you that I remain fully committed to my responsibilities and will complete all pending work promptly."
      );

      fetchPrediction();
      fetchBest();
    } catch {
      alert("Failed to generate excuse");
    } finally {
      setLoading(false);
    }
  };

  /* ================= ACTIONS ================= */

  const logout = () => {
    localStorage.clear();
    navigate("/login");
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
    alert("Proof email sent successfully");
  };

  const downloadPDF = () => {
    const pdf = new jsPDF();
    pdf.setFont("Times", "Normal");
    pdf.setFontSize(11);
    pdf.text(proof, 10, 15);
    pdf.save("Excuse_Proof.pdf");
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
          background: radial-gradient(circle at top, #0f172a, #020617);
          color: #e5e7eb;
          font-family: Inter, system-ui, sans-serif;
        }

        .topbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 24px;
        }

        .logout {
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.2);
          padding: 8px 16px;
          border-radius: 12px;
          cursor: pointer;
          transition: all .3s;
        }

        .logout:hover {
          background: #ef4444;
          border-color: #ef4444;
        }

        .dashboard {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 24px;
          padding: 24px;
        }

        .sidebar {
          background: rgba(255,255,255,0.06);
          border-radius: 18px;
          padding: 20px;
          border: 1px solid rgba(255,255,255,0.12);
        }

        .sidebar button {
          width: 100%;
          margin-bottom: 10px;
          padding: 12px;
          border-radius: 14px;
          border: 1px solid rgba(255,255,255,0.15);
          background: transparent;
          color: #e5e7eb;
          cursor: pointer;
          transition: all .25s ease;
        }

        .sidebar button:hover {
          background: rgba(255,255,255,0.12);
          transform: translateY(-2px);
        }

        .sidebar .active {
          background: linear-gradient(135deg,#fbbf24,#f59e0b);
          color: #000;
          font-weight: 600;
          box-shadow: 0 0 15px rgba(251,191,36,.5);
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
          border-radius: 18px;
          padding: 20px;
          border: 1px solid rgba(255,255,255,0.12);
        }

        .hero {
          border: 1px solid rgba(251,191,36,.45);
        }

        .actions {
          display: flex;
          gap: 12px;
          margin: 14px 0;
          flex-wrap: wrap;
        }

        .actions button {
          padding: 8px 14px;
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.15);
          background: rgba(255,255,255,0.08);
          cursor: pointer;
          transition: all .25s;
        }

        .actions button:hover {
          background: rgba(255,255,255,0.18);
          transform: translateY(-1px);
        }

        footer {
          background: radial-gradient(circle at top, #0f172a, #020617);
          border-top: 1px solid rgba(255,255,255,0.1);
          padding: 18px;
          text-align: center;
          color: #9ca3af;
        }
      `}</style>

      <div className="topbar">
        <h2>🧠 AI Excuse Generator</h2>
        <button className="logout" onClick={logout}>Logout</button>
      </div>

      <div className="dashboard">
        <aside className="sidebar">
          <h3>⚙ Controls</h3>

          <p>Scenario</p>
          {["Work","School","Social","Family"].map(s => (
            <button
              key={s}
              className={scenario === s ? "active" : ""}
              onClick={() => setScenario(s)}
            >{s}</button>
          ))}

          <p>Urgency</p>
          {["Normal","Urgent"].map(u => (
            <button
              key={u}
              className={urgency === u ? "active" : ""}
              onClick={() => setUrgency(u)}
            >{u}</button>
          ))}

          <button className="primary" onClick={generateExcuse}>
            {loading ? "Generating..." : "Generate Excuse"}
          </button>
        </aside>

        <main className="main">
          {currentExcuse && (
            <section className="card hero">
              <h2>🎯 Generated Excuse</h2>
              <p>“{currentExcuse.text}”</p>

              <div className="actions">
                <button onClick={markFavorite}>⭐ Save</button>
                <button onClick={downloadPDF}>📄 Download PDF</button>
                <button onClick={sendProofEmail}>📧 Email Proof</button>
              </div>

              <div className="rating">
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={ratingValue}
                  onChange={e => setRatingValue(e.target.value)}
                />
                <button onClick={rateExcuse}>Submit</button>
              </div>

              <p>🏆 Best Excuse: {bestExcuse || "No ratings yet."}</p>
            </section>
          )}

          <section className="card">
            <h3>📄 Proof</h3>
            <pre>{proof}</pre>
          </section>

          <section className="card">
            <h3>🙏 Apology</h3>
            <p>{apology}</p>
            <h4>🔮 Prediction</h4>
            <p>{prediction}</p>
          </section>
        </main>
      </div>

      <footer>
        © {new Date().getFullYear()} AI Excuse Generator. All rights reserved.
      </footer>
    </>
  );
};

export default DashboardPage;
