import net from "net";
import fs from "fs";
import path from "path"

const server = net.createServer();

const storagePath = path.join(process.cwd(), "storage", "video.mp4");


server.on("connection", (socket) => {
    console.log("New Connection!");

    socket.on("data", (data) => {
        const writeStream = fs.createWriteStream(storagePath);
        writeStream.write(data);

        writeStream.on("finish", () => {
            socket.write("Uploading file Completed")
            socket.end();
        })
    });


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