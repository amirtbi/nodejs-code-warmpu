import { Transform } from "stream";
import fs, { read } from "fs";
class Enctryption extends Transform {
    _transform(chunks, encoding, callbcak) {
        const maxValueStringByte = 255;
        for (let i = 0; i < chunks.length; ++i) {
            if (chunks[i] !== maxValueStringByte) {
                chunks[i] = chunks[i] + 1;
            }
        }
        callbcak(null, chunks);
    }
}

(async () => {
    const readStream = fs.createReadStream("read.txt", "utf-8");
    const writeStream = fs.createWriteStream("write.txt", { encoding: "utf-8" });

    const encrypt = new Enctryption();
    readStream.pipe(encrypt).pipe(writeStream);
})()

