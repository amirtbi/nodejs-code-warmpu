import net from "net";
import fs from "fs";
import path from "path"

const server = net.createServer();
const filePath = process.argv[2];

const storagePath = path.join(process.cwd(), "storage", path.basename(filePath));


server.on("connection", (socket) => {
    console.log("New Connection!");

    const writeStream = fs.createWriteStream(storagePath);

    socket.on("data", (data) => {
        if (!writeStream.write(data)) {
            socket.pause();
        }
    });

    writeStream.on("finish", () => {
        socket.write("Uploading file Completed")
        socket.end();
    });


    writeStream.on("drain", () => {
        socket.resume();
    })

    socket.on("end", () => {
        console.log("Server ended");
    })

    socket.on("close", () => {
        console.log("Server closed")
    })
})


server.listen(8000, () => {
    console.log("Listening to uploader server", server.address());
});