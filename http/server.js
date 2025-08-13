import http from "http";


const server = http.createServer();


server.on("request", (req, res) => {
    console.log("method", req.method);
    console.log("url", req.url);
    console.log("headers", req.headers);
    const chunks = [];
    req.on("data", (chunk) => {
        console.log("Chunk", chunk.toString("utf-8"))
        chunks.push(chunk);
    });

    req.on("end", () => {
        res.write(JSON.stringify({ message: "Received", data: chunks }))
    });
})

server.listen(8000, () => {
    console.log(`Running server at ${8000}`)
})