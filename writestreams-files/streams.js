import fs from "fs";
import path from "path";


const getPath = (filePath) => {
    return path.join(process.cwd(), filePath);
}


const jobWithoutStream = async () => {
    for (let i = 0; i < 100000; i++) {
        try {
            await fs.promises.appendFile(path.join(process.cwd(), "counters.txt"), `\n${i}`);
        }
        catch (e) {
            console.log("error in appending file", e);
        }
    }
}

let i = 0;
const jobWithStreams = async () => {
    let writeStream;
    const doJob = () => {
        writeStream = fs.createWriteStream(path.join(process.cwd(), "counters.txt"), { encoding: "utf8" });

        while (i < 100) {
            const buff = Buffer.from(`\n${i}`, "utf-8");

            i += 1;
            if (i === 99) {
                return writeStream.end(buff);
            }

            if (!writeStream.write(buff)) {
                break;
            }
        }


    }

    doJob();

    writeStream.on("error", () => {
        // close forcely, in case of happening error
        writeStream.close();
    })

    writeStream.on("drain", () => {
        doJob();
    });

    writeStream.on("finish", () => {
        console.log("end")
    });

    writeStream.on("close", () => {
        console.log("close");
    })
}


console.time("writemany");
jobWithStreams();
console.timeEnd("writemany")
