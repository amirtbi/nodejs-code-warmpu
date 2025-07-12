//import fs from "fs";
import fs from "fs/promises";




const readCommand = async () => {

    const openFileHanlder = await fs.open("./command.txt", "r");
    const events = await fs.watch("./command.txt");

    for await (const event of events) {
        if (event.eventType === "change") {
            const fileInfo = await openFileHanlder.stat();
            const size = await fileInfo.size;
            const buff = Buffer.alloc(size);
            const length = buff.byteLength;
            const position = 0;
            const offset = 0;
            const content = await openFileHanlder.read(buff, offset, length, position);
        }
    }
}


readCommand()