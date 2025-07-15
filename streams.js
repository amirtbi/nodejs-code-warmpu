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

const jobWithStreams = async () => {
    const writeStream = fs.createWriteStream(path.join(process.cwd(), "counters.txt"), { encoding: "utf8" });

    for (let i = 0; i < 500000; i++) {
        const buff = Buffer.from(`\n${i}`, "utf-8");
        writeStream.write(buff);
    }

    writeStream.end("Final line");

    writeStream.on("finish", () => {
        console.log("on finished ...")
    });

    writeStream.on("error", () => {
        console.log("error happened")
    })
}



console.time("writemany");
jobWithStreams();
console.timeEnd("writemany")
