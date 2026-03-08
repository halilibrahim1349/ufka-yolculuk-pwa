import { createServer } from "node:http";
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { extname, join, resolve } from "node:path";
import process from "node:process";

const rootDir = process.cwd();
const port = Number(process.env.PORT || 4173);
const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8"
};

const send = (response, statusCode, body, headers = {}) => {
  response.writeHead(statusCode, {
    "Content-Type": "text/plain; charset=utf-8",
    ...headers,
  });
  response.end(body);
};

const server = createServer(async (request, response) => {
  try {
    const host = request.headers.host || "localhost";
    const url = new URL(request.url || "/", "http://" + host);
    const pathname = decodeURIComponent(url.pathname === "/" ? "/index.html" : url.pathname);
    const filePath = resolve(rootDir, "." + pathname);

    if (!filePath.startsWith(resolve(rootDir))) {
      send(response, 403, "Forbidden");
      return;
    }

    let targetPath = filePath;
    const targetStat = await stat(targetPath).catch(() => null);
    if (!targetStat) {
      send(response, 404, "Not found");
      return;
    }

    if (targetStat.isDirectory()) {
      targetPath = join(targetPath, "index.html");
    }

    const extension = extname(targetPath).toLowerCase();
    const headers = {
      "Content-Type": mimeTypes[extension] || "application/octet-stream",
    };

    if (targetPath.endsWith("service-worker.js") || targetPath.endsWith("manifest.webmanifest")) {
      headers["Cache-Control"] = "no-cache";
    }

    if (targetPath.endsWith("service-worker.js")) {
      headers["Service-Worker-Allowed"] = "/";
    }

    response.writeHead(200, headers);
    createReadStream(targetPath).pipe(response);
  } catch {
    send(response, 500, "Server error");
  }
});

server.listen(port, () => {
  console.log("Ufka Yolculuk PWA sunucusu: http://localhost:" + port);
});
