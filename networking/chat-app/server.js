import net from "net";

const server = net.createServer();

const clients = [];

server.on("connection", (socket) => {

    socket.on("data", (msg) => {
        clients.forEach((client) => {
            client.write(`${msg}`)
        })
    })

    clients.push(socket);

    socket.on("error", () => {
        console.log("server errror");
    })

    socket.on("close", () => {
        console.log("Server closed...")
    })
});

server.listen(8000, () => {
    console.log(`Listening on`, server.address());
});
