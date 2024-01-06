require("dotenv").config();
const express = require("express");
const axios = require("axios");
const puppeteer = require("puppeteer-core");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.post("/scrape", async (req, res) => {
  const { url } = req.body;

  const browser = await puppeteer.launch({
    headless: "new",
  });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "domcontentloaded" });
  const scrapedText = await page.evaluate(() => document.body.innerText);
  await browser.close();
  const maxWords = 100;
  const words = scrapedText.split(" ");
  const truncatedSummary = words.slice(0, maxWords).join(" ");
  // console.log(truncatedSummary);

  const apiKey = process.env.API_KEY;

  const requestData = {
    language: "auto",
    text: truncatedSummary,
    min_length: 5,
    max_length: 100,
  };

  try {
    const response = await axios.post(
      "https://portal.ayfie.com/api/summarize",
      requestData,
      {
        headers: {
          "X-API-KEY": apiKey,
          accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    const summary = response.data.result;

    // console.log("inside try response", summary);
    res.status(201).json({ summary });
  } catch (error) {
    // console.error("inside Error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
