import fs from "fs";
import path from "path";
import customStream from "../custome-writable/customWritable.js";

const defaultSrcFolder = path.join(process.cwd(), "readstream-files");

const writeData = 1e6
const generateFakeData = (filePath) => {
    let i = 0;
    // const streamWrite = fs.createWriteStream(path.join(defaultSrcFolder, filePath), { encoding: "utf-8" });
    const streamWrite = new customStream({ highWaterMark: 18000, fileName: path.join(defaultSrcFolder, filePath) });
    const doJob = () => {
        while (i < writeData) {
            const buffer = Buffer.from(` ${i} `, "utf-8");
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
    let split = "";
    streamRead.on("data", (chunk) => {
        const numbers = chunk.toString("utf-8").split(" ");

        // Hanlding selective data, not Important
        if (Number(numbers[0]) !== Number(numbers[1]) - 1) {
            if (split) {
                numbers[0] = split.trim() + numbers[0].trim();
            }
        }


        if (Number(numbers[numbers.length - 2] + 1) !== Number(numbers[numbers.length - 1])) {
            split = numbers.pop();
        }


        numbers.forEach((number) => {

            let n = Number(number);

            if (n % 2 === 0) {
                if (!streamWrite.write(" " + n + " ")) {
                    streamRead.pause();
                }
            }
        })
    });


    streamWrite.on("drain", () => {
        streamRead.resume();
    });

    streamRead.on("end", () => {
        console.log("end of reading")
    });

}
generateFakeData("./data.txt");

//readStreamJob("./data.txt", "des.txt");