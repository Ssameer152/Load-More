const https = require("https");
const fs = require("fs");
const path = require("path");

// Path to your SSL certificate and key
const options = {
  key: fs.readFileSync(path.join(__dirname, "key.pem")),
  cert: fs.readFileSync(path.join(__dirname, "cert.pem")),
};

// Function to make a request to an external API
const fetchExternalApi = (callback) => {
  const apiOptions = {
    hostname: "dummyjson.com",
    path: "/products",
    method: "GET",
  };

  const req = https.request(apiOptions, (res) => {
    let data = "";

    // A chunk of data has been received.
    res.on("data", (chunk) => {
      data += chunk;
    });

    // The whole response has been received. Print out the result.
    res.on("end", () => {
      try {
        const parsedData = JSON.parse(data);
        callback(null, parsedData);
      } catch (error) {
        callback(error, null);
      }
    });
  });

  req.on("error", (e) => {
    callback(e, null);
  });

  req.end();
};

// Create an HTTPS server
const server = https.createServer(options, (req, res) => {
  // Log the incoming request method and URL
  console.log(`${req.method} ${req.url}`);

  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method === "GET" && req.url === "/") {
    fetchExternalApi((error, data) => {
      if (error) {
        console.error("Error fetching external API:", error);
        res.writeHead(500);
        res.end("Error fetching external API");
      } else {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(data));
      }
    });
  } else {
    res.writeHead(404);
    res.end("Not Found");
  }
});

// Define the port the server will listen on
const port = 8443; // You can use 443 if you have appropriate permissions

// Start the server with error handling
server.listen(port, (err) => {
  if (err) {
    console.error("Failed to start server:", err);
    return;
  }
  console.log(`Server is listening on port ${port}`);
});

server.on("error", (err) => {
  console.error("Server error:", err);
});
