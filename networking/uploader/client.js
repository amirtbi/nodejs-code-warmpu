import net from "net";
import fs from "fs";

const host = "127.0.0.1";
const port = 8000;
const filePath = "./video.mp4";

let socket;
const initConnection = () => {
    socket = net.createConnection({ host, port }, () => {

        try {
            const readStream = fs.createReadStream(filePath);
            readStream.pipe(socket);
        } catch (e) {
            console.log("Client failed")
        }
    })

    socket.on("data", (data) => {
        console.log(data.toString("utf-8"));
    })
    socket.on("end", () => {
        console.log("Client ended");
    })

    socket.on("close", (hadError) => {
        console.log("Client closed")
    })
}

initConnection();