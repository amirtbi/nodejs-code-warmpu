import net from "net";


const socket = net.createConnection({ host: "localhost", port: 8000 }, () => {
    const buff = Buffer.alloc(8);
    buff[0] = 10;
    buff[1] = 34
    socket.write(buff);
})

socket.on("data", (chunk) => {
    console.log("data", chunk.toString("utf-8"));
    socket.end();
})

socket.on("close", () => {
    console.log("closed connection");
})