import formidable from "formidable";
import express from "express";
import fs from "fs";
import http from "http";
import https from "https";
import cors from "cors";
import path from "path";
import os from "os";
import rateLimit from "express-rate-limit";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, "uploaded");

// Prevent path traversal: returns safe path within uploadDir or null
function safePath(fileName) {
  if (!fileName || typeof fileName !== "string") return null;
  const base = path.basename(fileName);
  if (!base || base === "." || base === "..") return null;
  const full = path.resolve(uploadDir, base);
  return full.startsWith(path.resolve(uploadDir) + path.sep) ? full : null;
}

// Check if dist folder exists
const distPath = path.join(__dirname, "../dist");
if (!fs.existsSync(distPath)) {
  console.error("\x1b[31m%s\x1b[0m", "Error: 'dist' folder not found!");
  console.log("\nPlease build the project first by running:");
  console.log("\x1b[33m%s\x1b[0m", "npm run build");
  console.log("\nThen try running the server again.\n");
  process.exit(1);
}

const app = express();

app.use(rateLimit({ windowMs: 60000, max: 100 }));
app.use(
  cors({
    origin: (origin, callback) => {
      return callback(null, true);
    },
  })
);

// Serve static files
app.use("/dist", express.static(distPath));
app.use("/assets", express.static(path.join(__dirname, "../samples/demo/assets")));
app.use("/font", express.static(path.join(__dirname, "../samples/demo/font")));

app.use("/demo/assets", express.static(path.join(__dirname, "../samples/demo/assets")));
app.use("/demo/font", express.static(path.join(__dirname, "../samples/demo/font")));

// Routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../samples/hello-world.html"));
});

app.get("/demo", (req, res) => {
  res.sendFile(path.join(__dirname, "../samples/demo/index.html"));
});

app.get("/hello-world", (req, res) => {
  res.sendFile(path.join(__dirname, "../samples/hello-world.html"));
});

app.get("/scenarios", (req, res) => {
  res.sendFile(path.join(__dirname, "../samples/scenarios/customized-empty-container.html"));
});

app.get("/scenarios/customized-empty-container", (req, res) => {
  res.sendFile(path.join(__dirname, "../samples/scenarios/customized-empty-container.html"));
});

app.get("/scenarios/use-file-input", (req, res) => {
  res.sendFile(path.join(__dirname, "../samples/scenarios/use-file-input.html"));
});

app.get("/scenarios/custom-scanner", (req, res) => {
  res.sendFile(path.join(__dirname, "../samples/scenarios/custom-scanner.html"));
});

// Allow upload feature
app.post("/upload", function (req, res) {
  try {
    // Create a new Formidable form
    const form = formidable({
      multiples: false,
      uploadDir: uploadDir,
      keepExtensions: true,
    });

    form.parse(req, (err, fields, files) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Error processing the file upload.");
      }

      const uploadedFile = files.uploadFile[0]; // Ensure the file field name matches the form
      if (!uploadedFile) {
        return res.status(400).send("No file uploaded.");
      }

      const sessionID = String(fields.sessionID?.[0] || fields.sessionID || "default_session").replace(/[^a-zA-Z0-9_-]/g, "_");
      const originalFileName = path.basename(uploadedFile.originalFilename || "unnamed");
      const newFileName = sessionID + "_" + Date.now() + "_" + originalFileName;

      const newFilePath = safePath(newFileName);
      if (!newFilePath) {
        return res.status(400).send("Invalid filename.");
      }

      // Validate source path is within uploadDir (formidable temp files)
      const srcPath = path.resolve(uploadedFile.filepath);
      if (!srcPath.startsWith(path.resolve(uploadDir) + path.sep)) {
        return res.status(400).send("Invalid upload path.");
      }

      // Move the uploaded file to the desired directory
      fs.rename(srcPath, newFilePath, (err) => {
        if (err) {
          console.error(err);
          return res.status(500).send("Error saving the file.");
        }
        console.log(`${originalFileName} uploaded successfully!`);
        res.send(`${originalFileName}:UploadedFileName:${newFileName}`);
      });
    });
  } catch (error) {
    res.status(500).send("An error occurred during file upload.");
  }
});

app.get("/download", (req, res) => {
  try {
    const fileName = req.query.fileName;
    if (!fileName) {
      return res.status(400).send('"fileName" required');
    }

    const filePath = safePath(fileName);
    if (!filePath) {
      return res.status(400).send("Invalid filename");
    }

    if (!fs.existsSync(filePath)) {
      return res.status(404).send("File not found");
    }

    const sanitizedName = path.basename(fileName);
    const ext = path.extname(sanitizedName).toLowerCase();
    const contentTypes = { ".bmp": "image/bmp", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".tif": "image/tiff", ".tiff": "image/tiff", ".png": "image/png", ".pdf": "application/pdf" };
    const contentType = contentTypes[ext];
    if (!contentType) {
      return res.status(400).send("Unsupported file type");
    }

    // Parse filename: sessionID_timestamp_originalFilename (use indexOf to avoid ReDoS)
    const parts = sanitizedName.split("_");
    const realFileName = parts.length >= 3 ? parts.slice(2).join("_") : sanitizedName;
    const encodedFileName = encodeURIComponent(realFileName).replace(/%20/g, " ");

    res.setHeader("Content-Type", contentType);
    res.setHeader("Content-Disposition", `attachment; filename="${encodedFileName}"`);

    res.sendFile(filePath, (err) => {
      if (err) {
        res.status(500).send("Error processing the file");
      }
    });
  } catch (error) {
    res.status(500).send("An error occurred while processing your request");
  }
});

app.post("/delete", (req, res) => {
  try {
    const fileName = req.query.fileName;
    if (!fileName) {
      return res.status(400).send('"fileName" required');
    }

    const filePath = safePath(fileName);
    if (!filePath) {
      return res.status(400).send("Invalid filename");
    }

    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);

      // Remove "read-only" attribute if applicable
      if ((stats.mode & fs.constants.S_IWUSR) === 0) {
        fs.chmodSync(filePath, 0o666); // Make file writable
      }

      fs.unlinkSync(filePath);
      return res.send("File deleted successfully.");
    } else {
      return res.status(404).send("File not found");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred while processing your request.");
  }
});

let httpPort = 3000;
let httpsPort = 3001;

// redirect handling
app.use((req, res, next) => {
  const host = req.get("Host"); // Get the host name from the request

  // Skip redirection if it's localhost with the correct HTTP port
  if (!req.secure && host !== `localhost:${httpPort}`) {
    // Replace the HTTP port with HTTPS port in the host
    const httpsHost = host.replace(`:${httpPort}`, `:${httpsPort}`);
    return res.redirect(["https://", httpsHost, req.url].join(""));
  }

  next(); // Proceed to the next middleware or route
});

// HTTPS server configuration
const httpsOptions = {
  key: fs.readFileSync(path.join(__dirname, "pem/key.pem")),
  cert: fs.readFileSync(path.join(__dirname, "pem/cert.pem")),
};

// Create HTTPS server
const httpsServer = https.createServer(httpsOptions, app);

// Create HTTP server
const httpServer = http.createServer(app);

// Add error handlers before starting servers
httpServer.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(`\x1b[31mError: Port ${httpPort} is already in use\x1b[0m`);
    console.log("\nTo fix this, you can:");
    console.log(`1. Update the port manually by changing \x1b[33mhttpPort\x1b[0m in the code`);
    console.log(`2. Close any other applications using port ${httpPort}`);
    console.log(`3. Wait a few moments and try again - the port might be in a cleanup state\n`);
  } else {
    console.error("\x1b[31mHTTP Server error:\x1b[0m", error);
  }
  process.exit(1);
});

httpsServer.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(`\x1b[31mError: Port ${httpsPort} is already in use\x1b[0m`);
    console.log("\nTo fix this, you can:");
    console.log(`1. Update the port manually by changing \x1b[33mhttpsPort\x1b[0m in the code`);
    console.log(`2. Close any other applications using port ${httpsPort}`);
    console.log(`3. Wait a few moments and try again - the port might be in a cleanup state\n`);
  } else {
    console.error("\x1b[31mHTTP Server error:\x1b[0m", error);
  }
  process.exit(1);
});

// Start the servers
httpServer.listen(httpPort, () => {
  console.log("\n\x1b[1m Dynamsoft Document Scanner Samples\x1b[0m\n");
  console.log("\x1b[36m HTTP URLs:\x1b[0m");
  console.log("\x1b[90m-------------------\x1b[0m");
  console.log("\x1b[33m Hello World:\x1b[0m    http://localhost:" + httpPort + "/hello-world");
  console.log("\x1b[33m Demo:\x1b[0m    http://localhost:" + httpPort + "/demo");
});

httpsServer.listen(httpsPort, "0.0.0.0", () => {
  const networkInterfaces = os.networkInterfaces();
  const ipv4Addresses = [];
  Object.keys(networkInterfaces).forEach((interfaceName) => {
    networkInterfaces[interfaceName].forEach((iface) => {
      if (iface.family === "IPv4" && !iface.internal) {
        ipv4Addresses.push(iface.address);
      }
    });
  });

  console.log("\n");
  console.log("\x1b[36m HTTPS URLs:\x1b[0m");
  console.log("\x1b[90m-------------------\x1b[0m");
  ipv4Addresses.forEach((localIP) => {
    console.log("\x1b[32m Hello World:\x1b[0m  https://" + localIP + ":" + httpsPort + "/hello-world");
    console.log("\x1b[32m Demo:\x1b[0m  https://" + localIP + ":" + httpsPort + "/demo");
  });
  console.log("\n");
  console.log("\x1b[90mPress Ctrl+C to stop the server\x1b[0m\n");
});
