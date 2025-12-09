// frontend/src/pages/DashboardPage.js
import FullScreenLoader from "../components/FullScreenLoader";
import jsPDF from "jspdf";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

const SCENARIOS = ["Work", "School", "Social", "Family"];

// Build professional templates (email, letter, WhatsApp) from excuse + user
const buildTemplates = (userName, scenario, excuseText) => {
  const name = userName || "User";
  const lowerScenario = scenario.toLowerCase();

  const email = `Subject: Request for consideration regarding absence

Dear Sir/Madam,

I hope you are doing well. I would like to inform you that I was unable to attend my ${lowerScenario} responsibilities due to the following reason:

"${excuseText}"

I sincerely apologize for any inconvenience caused and kindly request you to please consider my situation. I will ensure that any pending work or commitments are completed at the earliest.

Thank you for your understanding and support.

Regards,
${name}
`;

  const letter = `To,
The Concerned Authority,
[Institution / Organization Name]
[City]

Subject: Explanation for absence from ${scenario}

Respected Sir/Madam,

I, ${name}, wish to state that I was unable to attend my ${lowerScenario} duties on the concerned day due to the following reason:

"${excuseText}"

I regret any inconvenience this may have caused and request you to kindly excuse my absence. I assure you that I will fulfil my responsibilities with sincerity and avoid such situations in the future as far as possible.

Thanking you in anticipation.

Yours faithfully,
${name}
[Roll No. / Employee ID – optional]
`;

  const whatsapp = `Hi, I wanted to let you know that I couldn't attend ${lowerScenario} today because:

"${excuseText}"

Sorry for the inconvenience, and thank you for understanding.
– ${name}`;

  return { email, letter, whatsapp };
};

const DashboardPage = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("excuse_user") || "{}");

  const [scenario, setScenario] = useState("Work");
  const [urgency, setUrgency] = useState("normal");
  const [currentExcuse, setCurrentExcuse] = useState(null);
  const [proof, setProof] = useState("");
  const [apology, setApology] = useState("");
  const [history, setHistory] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [prediction, setPrediction] = useState("");
  const [ratingValue, setRatingValue] = useState(4);
  const [loading, setLoading] = useState(false);
  const [bestExcuse, setBestExcuse] = useState("");
  const [uiLoading, setUiLoading] = useState(null); // for loader overlay


const logout = () => {
  setUiLoading("Logging you out...");
  setTimeout(() => {
    localStorage.removeItem("excuse_token");
    localStorage.removeItem("excuse_user");
    navigate("/login");
  }, 700);
};


  const fetchHistory = async () => {
    const { data } = await API.get("/excuses/history");
    setHistory(data);
  };

  const fetchFavorites = async () => {
    const { data } = await API.get("/excuses/favorites");
    setFavorites(data);
  };

  const fetchPrediction = async () => {
    const { data } = await API.get("/excuses/prediction");
    setPrediction(data.message);
  };

  const fetchBest = async () => {
    const { data } = await API.get("/excuses/best");
    if (data.message) setBestExcuse(data.message);
    else setBestExcuse(data.text);
  };

  useEffect(() => {
    (async () => {
      await fetchHistory();
      await fetchFavorites();
      await fetchPrediction();
      await fetchBest();
    })();
  }, []);

  const generateExcuse = async () => {
    setLoading(true);
    try {
      const { data } = await API.post("/excuses/generate", {
        scenario,
        urgency
      });
      setCurrentExcuse(data.excuse);
      setProof(data.proof);
      setApology(data.apology);

      await fetchHistory();
      await fetchPrediction();
      await fetchBest();
    } catch (err) {
      console.error(err);
      alert("Failed to generate excuse");
    } finally {
      setLoading(false);
    }
  };

  const markFavorite = async () => {
    if (!currentExcuse?._id) return;
    await API.post("/excuses/favorite", {
      excuseId: currentExcuse._id,
      favorite: true
    });
    await fetchFavorites();
  };

  const rateExcuse = async () => {
    if (!currentExcuse?._id) return;
    await API.post("/excuses/rate", {
      excuseId: currentExcuse._id,
      rating: ratingValue
    });
    await fetchBest();
    await fetchHistory();
  };

  const speak = (text, lang = "en-US") => {
    if (!text) return;
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = lang;
    window.speechSynthesis.speak(utter);
  };

  const downloadProof = async () => {
  if (!proof || !currentExcuse?._id) return;

  setUiLoading("Preparing your PDF and emailing it...");

  try {
    // 1) Create and download PDF in browser
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4"
    });

    const marginLeft = 40;
    const marginTop = 50;
    const maxWidth = 515;

    doc.setFont("Times", "Normal");
    doc.setFontSize(12);

    const lines = doc.splitTextToSize(proof, maxWidth);
    doc.text(lines, marginLeft, marginTop);

    const safeName = (user?.name || "User").replace(/ /g, "_");
    const safeScenario = (currentExcuse?.scenario || scenario).replace(
      / /g,
      "_"
    );

    doc.save(`${safeScenario}_${safeName}.pdf`);

    // 2) Ask backend to email the same proof as PDF
    await API.post("/excuses/send-proof-email", {
      excuseId: currentExcuse._id
    });

    alert("PDF downloaded and emailed to your registered address.");
  } catch (err) {
    console.error(err);
    alert("PDF downloaded, but sending email failed.");
  } finally {
    setTimeout(() => setUiLoading(null), 600);
  }
};



  // Build templates only when we have an excuse and user name
  const templates =
    currentExcuse && user?.name
      ? buildTemplates(user.name, currentExcuse.scenario, currentExcuse.text)
      : null;

  return (
    <>
    {uiLoading && <FullScreenLoader message={uiLoading} />}

      <header className="top-bar">
        <div>
          <h1>🧠 AI Excuse Generator</h1>
          <p>Welcome, {user?.name}</p>
        </div>
        <button className="secondary-btn" onClick={logout}>
          Logout
        </button>
      </header>

      <main className="dashboard">
        <aside className="sidebar">
          <h2>⚙️ Controls</h2>

          <div className="sidebar-block">
            <h3>Scenario</h3>
            <div className="scenario-list">
              {SCENARIOS.map((s) => (
                <button
                  key={s}
                  className={`scenario-btn ${scenario === s ? "active" : ""}`}
                  onClick={() => setScenario(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="sidebar-block">
            <h3>Urgency</h3>
            <div className="urgency-toggle">
              <button
                className={
                  urgency === "normal" ? "urgency-btn active" : "urgency-btn"
                }
                onClick={() => setUrgency("normal")}
              >
                Normal
              </button>
              <button
                className={
                  urgency === "urgent" ? "urgency-btn active" : "urgency-btn"
                }
                onClick={() => setUrgency("urgent")}
              >
                Urgent
              </button>
            </div>
          </div>

          <button
            className="generate-btn"
            onClick={generateExcuse}
            disabled={loading}
          >
            {loading ? "Generating..." : "✨ Generate Excuse"}
          </button>

          <p className="sidebar-footer">
            Major Project – AI Excuse Generator (Full Stack)
          </p>
        </aside>

        <section className="main-content">
          <section className="excuse-card">
            {currentExcuse ? (
              <>
                <h2>
                  🎯 Generated Excuse{" "}
                  <span className="tag">for {currentExcuse.scenario}</span>
                </h2>
                <p className="excuse-text">“{currentExcuse.text}”</p>

                <div className="actions-row">
                  <button onClick={markFavorite}>⭐ Save to Favorites</button>
                  <button onClick={downloadProof}>📄 Download Proof</button>
                  <button onClick={() => speak(currentExcuse.text, "en-US")}>
                    ▶️ English Voice
                  </button>
                  <button onClick={() => speak(currentExcuse.text, "hi-IN")}>
                    🇮🇳 Hindi Voice
                  </button>
                </div>

                <div className="rating-section">
                  <h3>⭐ Rate this Excuse</h3>
                  <div className="rating-control">
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={ratingValue}
                      onChange={(e) =>
                        setRatingValue(parseInt(e.target.value, 10))
                      }
                    />
                    <span>{ratingValue} / 5</span>
                    <button onClick={rateExcuse}>Submit</button>
                  </div>
                  <p className="best-excuse">
                    🏆 Best Excuse so far: <b>{bestExcuse}</b>
                  </p>
                </div>
              </>
            ) : (
              <div className="empty-state">
                <p>Use the controls to generate your first excuse ⚡</p>
              </div>
            )}
          </section>

          <section className="secondary-section">
            <div className="secondary-column">
              <h3>📄 Proof</h3>
              {proof ? (
                <textarea
                  className="proof-box"
                  rows={10}
                  value={proof}
                  readOnly
                />
              ) : (
                <p className="muted">
                  Generate an excuse to see the proof here.
                </p>
              )}
            </div>

            <div className="secondary-column">
              <h3>🙏 Apology</h3>
              {apology ? (
                <p className="apology-text">{apology}</p>
              ) : (
                <p className="muted">
                  Generate an excuse to see the apology.
                </p>
              )}

              <h3 style={{ marginTop: "1.2rem" }}>🔮 Prediction</h3>
              <p>{prediction}</p>
            </div>

            <div className="secondary-column">
              <h3>📧 Communication Templates</h3>
              {templates ? (
                <>
                  <p className="muted" style={{ marginBottom: "6px" }}>
                    Copy a template and customize names / dates before sending.
                  </p>

                  <h4 style={{ margin: "6px 0 4px" }}>Office Email</h4>
                  <textarea
                    className="proof-box"
                    rows={6}
                    value={templates.email}
                    readOnly
                  />

                  <h4 style={{ margin: "10px 0 4px" }}>Formal Letter</h4>
                  <textarea
                    className="proof-box"
                    rows={6}
                    value={templates.letter}
                    readOnly
                  />

                  <h4 style={{ margin: "10px 0 4px" }}>WhatsApp Message</h4>
                  <textarea
                    className="proof-box"
                    rows={4}
                    value={templates.whatsapp}
                    readOnly
                  />
                </>
              ) : (
                <p className="muted">
                  Generate an excuse to see ready-made email, letter and
                  WhatsApp templates here.
                </p>
              )}
            </div>
          </section>

          <section className="bottom-section">
            <div className="bottom-column">
              <h3>⏱️ History</h3>
              {history.length > 0 ? (
                <div className="table">
                  <div className="table-header">
                    <span>Scenario</span>
                    <span>Excuse</span>
                    <span>Rating</span>
                    <span>Time</span>
                  </div>
                  {history.map((item) => (
                    <div className="table-row" key={item._id}>
                      <span>{item.scenario}</span>
                      <span className="table-excuse">{item.text}</span>
                      <span>{item.rating || "-"}</span>
                      <span>
                        {new Date(item.createdAt).toLocaleString("en-IN")}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="muted">No history yet.</p>
              )}
            </div>

            <div className="bottom-column">
              <h3>⭐ Favorites</h3>
              {favorites.length > 0 ? (
                <ul className="favorites-list">
                  {favorites.map((fav) => (
                    <li key={fav._id}>{fav.text}</li>
                  ))}
                </ul>
              ) : (
                <p className="muted">No favorites yet.</p>
              )}
            </div>
          </section>
        </section>
      </main>
    </>
  );
};

export default DashboardPage;
