const fetchHistory = async () => {
  const { data } = await API.get("/api/excuses/history");
  setHistory(data);
};

const fetchFavorites = async () => {
  const { data } = await API.get("/api/excuses/favorites");
  setFavorites(data);
};

const fetchPrediction = async () => {
  const { data } = await API.get("/api/excuses/prediction");
  setPrediction(data.message);
};

const fetchBest = async () => {
  const { data } = await API.get("/api/excuses/best");
  if (data.message) setBestExcuse(data.message);
  else setBestExcuse(data.text);
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
  await API.post("/api/excuses/favorite", {
    excuseId: currentExcuse._id,
    favorite: true
  });
  await fetchFavorites();
};

const rateExcuse = async () => {
  if (!currentExcuse?._id) return;
  await API.post("/api/excuses/rate", {
    excuseId: currentExcuse._id,
    rating: ratingValue
  });
  await fetchBest();
  await fetchHistory();
};

await API.post("/api/excuses/send-proof-email", {
  excuseId: currentExcuse._id
});
