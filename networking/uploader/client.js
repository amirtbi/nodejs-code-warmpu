import net from "net";
import fs from "fs";
import path from "path";

const host = "127.0.0.1";
const port = 8000;
const filePath = path.basename(process.argv[2]);

const initConnection = () => {
    let socket;
    let fileReadStream;
    socket = net.createConnection({ host, port }, () => {
        try {

            fileReadStream = fs.createReadStream(filePath);

            console.log(`----fileName:${filePath}-----`);

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