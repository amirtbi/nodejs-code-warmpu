//import fs from "fs";
import fs from "fs/promises";




const readCommand = async () => {

    const openFileHanlder = await fs.open("./command.txt", "r");

    const events = await fs.watch("./command.txt");

    openFileHanlder.on("change", async () => {
        const fileInfo = await openFileHanlder.stat();
        const size = await fileInfo.size;
        const buff = Buffer.alloc(size);
        const length = buff.byteLength;
        // the position that we want to start reading the file
        const position = 0;
        const offset = 0;
        // Reading the whole content
        await openFileHanlder.read(buff, offset, length, position);

        console.log(buff.toString("utf-8"))
    })

    for await (const event of events) {
        if (event.eventType === "change") {
            openFileHanlder.emit("change");
        }
    }
}


readCommand()