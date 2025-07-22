import { read } from "fs";
// import fs from "fs/promises";
import fs from "fs";
import path from "path";
import FileReadStream from "../custome-readable/customReadable.js";
import WritableStream from "../custome-writable/customWritable.js";

// (async () => {
//     const srcFileContent = await fs.readFile(path.join(process.cwd(), "copy", "text.txt"));
//     await fs.writeFile(path.join(process.cwd(), "copy", "copy.txt"), srcFileContent);
// })()


// (async () => {

//     try {
//         const srcFile = await fs.open(path.join(process.cwd(), "copy", "text.txt"), "r");
//         const destFile = await fs.open(path.join(process.cwd(), "copy", "copy.txt"), "w");
//         let bytesRead = -1;

//         while (bytesRead !== 0) {
//             const srcFileContent = await srcFile.read(); // ready chunk by chunk based on the default buffer
//             bytesRead = srcFileContent.bytesRead;
//             await destFile.write(srcFileContent.buffer.slice(0, bytesRead));
//         }
//     }
//     catch (e) {
//         console.log("Errro happened during writing and copying file.")
//     }
// })()


// using pipe
// (async () => {
//     const readStream = fs.createReadStream(path.join(process.cwd(), "copy", "text.txt"));
//     const writeStream = fs.createWriteStream(path.join(process.cwd(), "copy", "copy-stream.txt"), { encoding: "utf-8" });
//     readStream.pipe(writeStream);

//     readStream.on("end", () => {
//         console.log("reading ended")
//     });

//     writeStream.on("finish", () => {
//         console.log("writting finished")
//     });

// })()

// custom stream 

(() => {
    const readStream = new FileReadStream({ highWaterMark: 1800, fileName: path.join(process.cwd(), "copy", "data.txt") });
    const writeStream = new WritableStream({ highWaterMark: 1800, fileName: path.join(process.cwd(), "copy", "copy-stream.txt") });


    readStream.on("data", (chunk) => {
        const data = chunk.toString("utf-8").split(" ");
        writeStream.write(chunk)
        data.forEach(dataItem => {

            if (!writeStream.write(` ${dataItem} `)) {
                readStream.pause();
            }
        });
        console.log("chunk data", chunk.toString("utf-8"));
    });

    readStream.on("end", () => {
        console.log("End of reading data");
        writeStream.end(); // finalize the writting;
    });

    writeStream.on("drain", () => {
        readStream.resume();
    });

    writeStream.on("finish", () => {
        console.log("End of writting stream");
    });

})()