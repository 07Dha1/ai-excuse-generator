import React, { useEffect, useState } from "react";
import API from "../api";

const DashboardPage = () => {
  const [history, setHistory] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [prediction, setPrediction] = useState("");
  const [bestExcuse, setBestExcuse] = useState("");
  const [currentExcuse, setCurrentExcuse] = useState(null);
  const [proof, setProof] = useState("");
  const [apology, setApology] = useState("");
  const [scenario, setScenario] = useState("Work");
  const [urgency, setUrgency] = useState("Normal");
  const [ratingValue, setRatingValue] = useState(5);
  const [loading, setLoading] = useState(false);

  /* ================= FETCH FUNCTIONS ================= */

  const fetchHistory = async () => {
    try {
      const { data } = await API.get("/api/excuses/history");
      setHistory(data);
    } catch (err) {
      console.error("History error", err);
    }
  };

  const fetchFavorites = async () => {
    try {
      const { data } = await API.get("/api/excuses/favorites");
      setFavorites(data);
    } catch (err) {
      console.error("Favorites error", err);
    }
  };

  const fetchPrediction = async () => {
    try {
      const { data } = await API.get("/api/excuses/prediction");
      setPrediction(data.message);
    } catch (err) {
      console.error("Prediction error", err);
    }
  };

  const fetchBest = async () => {
    try {
      const { data } = await API.get("/api/excuses/best");
      setBestExcuse(data.message || data.text || "");
    } catch (err) {
      console.error("Best excuse error", err);
    }
  };

  /* ================= MAIN ACTIONS ================= */

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
    try {
      await API.post("/api/excuses/favorite", {
        excuseId: currentExcuse._id,
        favorite: true
      });
      await fetchFavorites();
    } catch (err) {
      console.error("Favorite error", err);
    }
  };

  const rateExcuse = async () => {
    if (!currentExcuse?._id) return;
    try {
      await API.post("/api/excuses/rate", {
        excuseId: currentExcuse._id,
        rating: ratingValue
      });
      await fetchBest();
      await fetchHistory();
    } catch (err) {
      console.error("Rating error", err);
    }
  };

  const sendProofEmail = async () => {
    if (!currentExcuse?._id) return;
    try {
      await API.post("/api/excuses/send-proof-email", {
        excuseId: currentExcuse._id
      });
      alert("Proof email sent successfully");
    } catch (err) {
      console.error("Email error", err);
      alert("Failed to send proof email");
    }
  };

  /* ================= INITIAL LOAD ================= */

  useEffect(() => {
    fetchHistory();
    fetchFavorites();
    fetchPrediction();
    fetchBest();
  }, []);

  /* ================= UI ================= */

  return (
    <div style={{ padding: "20px" }}>
      <h2>AI Excuse Generator</h2>

      <div>
        <select value={scenario} onChange={(e) => setScenario(e.target.value)}>
          <option>Work</option>
          <option>School</option>
          <option>Family</option>
          <option>Social</option>
        </select>

        <select value={urgency} onChange={(e) => setUrgency(e.target.value)}>
          <option>Normal</option>
          <option>Urgent</option>
        </select>

        <button onClick={generateExcuse} disabled={loading}>
          {loading ? "Generating..." : "Generate Excuse"}
        </button>
      </div>

      {currentExcuse && (
        <div>
          <h3>Excuse</h3>
          <p>{currentExcuse.text}</p>

          <h4>Proof</h4>
          <p>{proof}</p>

          <h4>Apology</h4>
          <p>{apology}</p>

          <button onClick={markFavorite}>⭐ Favorite</button>

          <div>
            <input
              type="number"
              min="1"
              max="5"
              value={ratingValue}
              onChange={(e) => setRatingValue(e.target.value)}
            />
            <button onClick={rateExcuse}>Rate</button>
          </div>

          <button onClick={sendProofEmail}>Send Proof Email</button>
        </div>
      )}

      <hr />

      <h3>Prediction</h3>
      <p>{prediction}</p>

      <h3>Best Excuse</h3>
      <p>{bestExcuse}</p>
    </div>
  );
};

export default DashboardPage;
