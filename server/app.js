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

  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "domcontentloaded" });
  const scrapedText = await page.evaluate(() => document.body.innerText);
  await browser.close();
  try {
    const maxWords = 100;
    const words = scrapedText.split(" ");
    const truncatedSummary = words.slice(0, maxWords).join(" ");
    console.log("scrapedText", scrapedText);
    res.status(201).json({ summary: truncatedSummary });
  } catch (error) {
    // console.log("error", error);
    res.status(404).json(error);
  }
});

//   try {
//     const apiKey = process.env.API_KEY;
//     const chatGPTResponse = await axios.post(
//       "https://api.openai.com/v1/chat/completions",
//       {
//         model: "gpt-3.5-turbo",
//         messages: [
//           { role: "system", content: "You are a helpful assistant." },
//           { role: "user", content: scrapedText },
//         ],
//       },
//       {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${apiKey}`,
//         },
//       }
//     );

//     const summary = chatGPTResponse.data.choices[0].message.content;

//     res.status(201).json({ summary });
//   } catch (error) {
//     console.log("ChatGPT API Response:", chatGPTResponse.data);
//     res.status(404).json(error);
//   }
// });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
