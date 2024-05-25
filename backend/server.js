const express = require("express");
const app = express();
const port = 5000;
const https = require("https");
const cors = require("cors");
const url = `https://dummyjson.com/products`;

app.use(cors());

app.get("/products", (req, res) => {
  https
    .get(url, (apiRes) => {
      let data = "";

      apiRes.on("data", (chunk) => {
        data += chunk;
      });

      apiRes.on("end", () => {
        try {
          const products = JSON.parse(data).products;
          res.json({ products });
        } catch (error) {
          res.status(500).json({ error: "Failed to parse products data" });
        }
      });
    })
    .on("error", (error) => {
      console.error("Error fetching the products:", error);
      res.status(500).json({ error: "Failed to fetch products" });
    });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
