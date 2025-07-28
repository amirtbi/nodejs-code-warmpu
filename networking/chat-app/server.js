import net from "net";

const server = net.createServer();

const clients = [];

server.on("connection", (socket) => {
    const clientId = `id-${clients.length + 1}`;
    socket.write(`id-${clients.length + 1}`);


    clients.forEach((client) => {
        client.socket.write(`User ${clientId} joined!`);
    })

    socket.on("data", (data) => {
        const dataString = data.toString("utf-8");
        const id = dataString.substring(0, data.indexOf("-"));
        const message = dataString.split("-").pop();

        clients.forEach((client) => {
            client.socket.write(`> User ${id}: ${message}`)
        })
    })

    clients.push({ id: clientId, socket });

    socket.on("error", () => {
        console.log("server errror");
    })

    socket.on("end", () => {
        const index = clients.findIndex((c) => c.socket === socket);
        if (index !== -1) {
            const leftClient = clients[index];
            clients.splice(index, 1);

            clients.forEach((client) => {
                client.socket.write(`> User ${leftClient.id} left!`);
            });
        }
    });

    socket.on("close", (hadError) => {
        if (hadError) {
            console.log(`Client connection closed with error or unexpectedly (e.g., Ctrl+C).`)
        }
        const index = clients.findIndex((c) => c.socket === socket);
        if (index !== -1) {
            const leftClient = clients[index];
            clients.splice(index, 1);

            clients.forEach((client) => {
                client.socket.write(`> User ${leftClient.id} left!`);
            });
        }
    });
});

server.listen(8000, () => {
    console.log(`Listening on`, server.address());
});
