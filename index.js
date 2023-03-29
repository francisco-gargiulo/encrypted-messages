// Importing required modules
const http = require("http");
const crypto = require("crypto");
const url = require("url");
const fs = require("fs");
const path = require("path");

// Defining port number
const PORT = 3000;

// Function to create RSA key pair
function createKeyPair() {
  const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
    modulusLength: 2048,
  });

  const publicKeyJwk = publicKey.export({ format: "jwk" });

  return { publicKeyJwk, privateKey };
}

// Function to decrypt data using RSA private key
function decryptData(data, privateKey) {
  const encryptedDataBuffer = Buffer.from(data, "base64");
  const decryptedDataBuffer = crypto.privateDecrypt(
    {
      key: privateKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: "sha256",
    },
    encryptedDataBuffer
  );

  return decryptedDataBuffer.toString("utf-8");
}

// Generating RSA key pair
const { publicKeyJwk, privateKey } = createKeyPair();

// Creating HTTP server
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);

  // Handling GET requests
  if (req.method === "GET") {
    handleGetRequest(parsedUrl, res);
  } 
  // Handling POST requests
  else if (req.method === "POST") {
    handlePostRequest(req, res);
  } 
  // Handling requests for non-existing resources
  else {
    handleNotFound(res);
  }
});

// Function to handle GET requests
function handleGetRequest(parsedUrl, res) {
  if (parsedUrl.pathname === "/publicKey.jwk") {
    // Sending public key in JWK format
    res.setHeader("Content-Type", "application/jwk+json");
    res.end(JSON.stringify(publicKeyJwk));
  } 
  // Serving index.html file
  else if (
    parsedUrl.pathname === "/" ||
    parsedUrl.pathname === "/index.html"
  ) {
    const filePath = path.join(__dirname, "www", "index.html");

    // Reading index.html file and sending its contents as response
    fs.readFile(filePath, "utf8", (err, fileData) => {
      if (err) {
        handleNotFound(res);
      } else {
        res.setHeader("Content-Type", "text/html");
        res.end(fileData);
      }
    });
  } 
  // Handling requests for non-existing resources
  else {
    handleNotFound(res);
  }
}

// Function to handle POST requests
function handlePostRequest(req, res) {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
  });

  req.on("end", () => {
    const decryptedMessage = decryptData(body, privateKey);
    console.log(`Decrypted message: ${decryptedMessage}`);
    res.end("Message received and decrypted.");
  });
}

// Function to handle requests for non-existing resources
function handleNotFound(res) {
  res.writeHead(404);
  res.end("Not found");
}

// Starting HTTP server
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
