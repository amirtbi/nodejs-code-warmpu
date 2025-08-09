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
const LIMIT = 500_000_000;

const jobWithStreams = async () => {
    const writeStream = fs.createWriteStream(path.join(process.cwd(), "counters.txt"), { encoding: "utf8" });

    const write = () => {
        let ok = true;
        while (i < LIMIT && ok) {
            const buff = Buffer.from(`\n${i}`, "utf-8");
            i++;
            if (i === LIMIT) {
                return writeStream.end(buff);
            }
            ok = writeStream.write(buff);
        }

        if (i < LIMIT) {
            writeStream.once("drain", write);
        }
    };

    write();

    writeStream.on("finish", () => {
        console.log("✅ Finished writing");
    });

    writeStream.on("close", () => {
        console.log("🛑 Stream closed");
    });

    writeStream.on("error", (err) => {
        console.error("❌ Write error:", err);
        writeStream.close();
    });
};

console.time("writemany");
jobWithStreams().then(() => {
    console.timeEnd("writemany");
});