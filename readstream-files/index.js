import fs from "fs";
import path from "path";

const defaultSrcFolder = path.join(process.cwd(), "readstream-files");

const writeData = 100000000
const generateFakeData = (filePath) => {
    let i = 0;
    const streamWrite = fs.createWriteStream(path.join(defaultSrcFolder, filePath), { encoding: "utf-8" });
    const doJob = () => {
        while (i < writeData) {
            const buffer = Buffer.from(`\n${i}`, "utf-8");
            i += 1;

            if (i === writeData - 1) {
                return streamWrite.end(buffer);
            }

            if (!streamWrite.write(buffer)) {
                break;
            }
        }
    }


    streamWrite.on("error", () => {
        streamWrite.close();
        console.log("stream errored...");
    });

    streamWrite.on("drain", () => {
        doJob();
    });

    streamWrite.on("finish", () => {
        console.log("stream finished...");
    });

    streamWrite.on("close", () => {
        console.log("stream close...");
    });

    doJob();
};


// Bad solution for reading and copying big data
// const readStreamJob = (srcPath, destPath) => {
//     const streamRead = fs.createReadStream(path.join(streamPath, srcPath), { highWaterMark: 60 * 1024 })
//     const streamWrite = fs.createWriteStream(path.join(streamPath, destPath), { encoding: "utf-8" })
//     streamRead.on("data", (chunk) => {
//         streamWrite.write(chunk);
//         console.log("readable chunk", chunk.length)
//     });

// }


// Better solution for reading and copying big data
const readStreamJob = (srcPath, destPath) => {
    const streamRead = fs.createReadStream(path.join(defaultSrcFolder, srcPath), { highWaterMark: 60 * 1024 })
    const streamWrite = fs.createWriteStream(path.join(defaultSrcFolder, destPath), { encoding: "utf-8" })
    streamRead.on("data", (chunk) => {
        if (!streamWrite.write(chunk)) {
            streamRead.pause();
        }
        console.log("readable chunk", chunk.length)
    });


    streamWrite.on("drain", () => {
        streamRead.resume();
    })

}

// generateFakeData("./data.txt");

readStreamJob("./data.txt", "des.txt");