async function fetchSummary() {
  const urlInput = document.getElementById("urlInput").value;
  const summaryContainer = document.getElementById("summaryContainer");

  summaryContainer.innerHTML = "<h3>Loading...</h3>";
  try {
    const response = await fetch("https://summarize-eqj8.onrender.com/scrape", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url: urlInput }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
    const data = await response.json();
    summaryContainer.innerText = data.summary;
  } catch (error) {
    summaryContainer.innerText = `Error: ${error.message}`;
  }
  document.getElementById("urlInput").value = "";
}
