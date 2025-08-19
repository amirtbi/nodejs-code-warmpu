import http from "http";


const server = http.createServer();


server.on("request", (req, res) => {
    const chunks = [];

    req.on("data", (chunk) => {
        chunks.push(chunk.toString());
    });

    req.on("end", () => {
        console.log("data", chunks);
        res.setHeader("Content-type", "application/json");
        res.writeHead(200, "ok");
        res.end(JSON.stringify({ message: "Sent finish flag" }));
    });
})

server.listen(8000, () => {
    console.log(`Running server at ${8000}`)
})