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
    }
})

request.on("response", (response) => {
    console.log("----statusCode----", response.statusCode);
    console.log("----headers----", response.headers);
    response.on("data", (chunk) => {
        console.log("----Body----", chunk.toString("utf-8"))
    })

    response.on("end", () => {
        console.log("----nore more data and response----")
    })
})


request.write(JSON.stringify({ message: "hi there" }));


request.end(JSON.stringify({ message: "finished" }));

