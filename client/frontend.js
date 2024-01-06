async function fetchSummary() {
  const urlInput = document.getElementById("urlInput").value;

  const response = await fetch("http://localhost:3000/scrape", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url: urlInput }),
  });

  const data = await response.json();
  document.getElementById("summaryContainer").innerText = data.summary;
  document.getElementById("urlInput").value = "";
}
