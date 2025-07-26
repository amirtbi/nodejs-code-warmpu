import net from "net";

const server = net.createServer();

const clients = [];

server.on("connection", (socket) => {

    socket.on("data", (msg) => {
        clients.forEach((client) => {
            client.write(`\n${msg}`)
        })
    })

    clients.push(socket);
});

server.listen(8000, () => {
    console.log(`Listening on`, server.address());
});
