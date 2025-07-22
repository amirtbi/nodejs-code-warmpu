import { Readable } from "stream";
import fs from "fs";

class FileReadStream extends Readable {
    constructor({ highWaterMark, fileName }) {
        super({ highWaterMark });
        this.fileName = fileName;
    }

    _construct(callback) {
        fs.open(this.fileName, "r", (err, fd) => {
            if (err) return callback(err);
            this.fd = fd;
            callback();
        })
    }

    _read(size) {
        const buffer = Buffer.alloc(size);
        fs.read(this.fd, buffer, 0, size, null, (err, bytesRead) => {
            if (err) this.destroy(err);
            this.push(bytesRead > 0 ? buffer.subarray(0, bytesRead) : null);

        })
    }
    _destroy(error, callback) {
        if (this.fd) {
            fs.close(this.fd, err => callback(err || error));
        }
    }


}


// const stream = new FileReadStream({ highWaterMark: 1800, fileName: "data.txt" })


// stream.on("data", (chunk) => {
//     console.log("chunk", chunk.toString("utf-8"));
// });

// stream.on("end", () => {
//     console.log("end");
// });

export default FileReadStream;
