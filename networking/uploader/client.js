import net from "net";
import fs, { read } from "fs";

const host = "127.0.0.1";
const port = 8000;
const filePath = "./huge-content.txt";

const initConnection = () => {
    let socket;
    let fileReadStream;
    socket = net.createConnection({ host, port }, () => {
        try {

            fileReadStream = fs.createReadStream(filePath);

            // readStream.pipe(socket);

            fileReadStream.on("data", (data) => {
                if (!socket.write(data)) {
                    fileReadStream.pause();
                }
            })

            fileReadStream.on("end", () => {
                console.log("The file uploaded successfully")
                socket.end();
            })

        } catch (e) {
            console.log("Client failed")
        }
    })

    socket.on("drain", () => {
        fileReadStream.resume();
    });


    socket.on("end", () => {
        console.log("Client ended");
    })

    socket.on("close", (hadError) => {
        console.log("Client closed")
    })
}

initConnection();