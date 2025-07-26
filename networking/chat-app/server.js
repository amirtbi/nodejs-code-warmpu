import net from "net";

const server = net.createServer();


server.on("connection", (socket) => {
    console.log("New connection is started")
});

server.listen(8000, () => {
    console.log(`Listening on`, server.address());
});
