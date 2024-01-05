async function fetchSummary() {
  const urlInput = document.getElementById("urlInput").value;

  const response = await fetch("https://assignment-in0z.onrender.com/scrape", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url: urlInput }),
  });

  const data = await response.json();
  document.getElementById("summaryContainer").innerText = data.summary;
}
