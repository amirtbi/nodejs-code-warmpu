import http from "http";
import fs from "fs";
import path from "path";

const server = http.createServer();


server.on("request", (request, response) => {


    if (request.url === "/" && request.method === "GET") {
        response.setHeader("Content-type", "text/html");
        const readStreamFilePath = path.join(process.cwd(), "public", "index.html");
        const readStream = fs.createReadStream(readStreamFilePath);

        readStream.pipe(response);
    }
    if (request.url === "/style.css" && request.method === "GET") {
        response.setHeader("Content-type", "text/css");
        const readStreamFilePath = path.join(process.cwd(), "public", "style.css");
        const readStream = fs.createReadStream(readStreamFilePath);

        readStream.pipe(response);
    }
    if (request.url === "/script.js" && request.method === "GET") {
        response.setHeader("Content-type", "text/javascript");
        const readStreamFilePath = path.join(process.cwd(), "public", "script.js");
        const readStream = fs.createReadStream(readStreamFilePath);

        readStream.pipe(response);
    }
    if (request.url === "/login" && request.method === "POST") {
        response.setHeader("Content-type", "application/json");
        response.statusCode = 200;
        const body = {
            message: "Welcome to rayan"
        }

        response.write(JSON.stringify(body));
        response.end()
    }

    if (request.url === "/user" && request.method === "PUT") {
        response.setHeader("Content-type", "application/json");
        response.statusCode = 200;
        const body = {
            message: "updating..."
        }

        response.write(JSON.stringify(body));
        response.end()
    }

    if (request.url === "/upload" && request.method === "POST") {
        response.setHeader("Content-type", "application/json");
        const writeStream = fs.createWriteStream(path.join(process.cwd(), "storage", "image.jpeg"));
        request.pipe(writeStream);
        response.statusCode = 200;

        request.on("end", () => {
            response.end(JSON.stringify({ message: "File was uploaded" }))
        })

    }
})

server.listen(9000, () => {
    console.log("Listening to 9000 server");
})