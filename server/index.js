require("dotenv").config();
const express = require("express");
const axios = require("axios");
const puppeteer = require("puppeteer");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.post("/scrape", async (req, res) => {
  const { url } = req.body;
  let scrapedText;
  const browser = await puppeteer.launch({
    args: [
      "--disable-setuid-sandbox",
      "--no-sandbox",
      "--single-process",
      "--no-zygote",
    ],
    headless: "new",
    executablePath:
      process.env.NODE_ENV === "production"
        ? process.env.PUPPETEER_EXECUTABLE_PATH
        : puppeteer.executablePath(),
  });
  const page = await browser.newPage();
  try {
    await page.goto(url, { waitUntil: "domcontentloaded" });
    scrapedText = await page.evaluate(() => document.body.innerText);
  } catch (error) {
    console.error("in error:", error);
  } finally {
    await browser.close();
  }
  const maxWords = 100;
  const words = scrapedText.split(" ");
  const truncatedSummary = words.slice(0, maxWords).join(" ");
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
