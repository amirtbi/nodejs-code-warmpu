import http from "http";

const agent = http.Agent({ keepAlive: true });

const request = http.request({
    agent: agent,
    hostname: "localhost",
    port: 8000,
    method: "POST",
    path: "/create-post",
    headers: {
        "Content-Types": "application/json",
        "content-length": Buffer.byteLength(JSON.stringify({ message: "hi there" }), "utf-8")
    }
})

request.on("response", (response) => {
    console.log("resposne")
})


request.write(JSON.stringify({ message: "hi there" }));

request.end(JSON.stringify({ message: "finished" }));