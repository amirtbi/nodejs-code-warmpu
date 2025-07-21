import { Writable } from "stream";
import fs from "fs";
import path from "path";

class FileWriteStream extends Writable {
    constructor({ highWaterMark, fileName }) {
        super({ highWaterMark });

        this.fileName = fileName;
        this.fd = null;
        this.chunks = [];
        this.chunkSize = 0;
        this.writesCount = 0;
        console.log("fil;ename", this.fileName)



    }

    // Runs before _write
    _construct(callback) {
        fs.open(this.fileName, "w", (error, fd) => {
            if (error) {
                callback(error);
            } else {
                this.fd = fd;
                callback();
            }
        })
    }

    _write(chunk, encoding, callback) {
        console.log("chunk", chunk)
        this.chunkSize += chunk.length;
        this.chunks.push(chunk);

        // Write to buffer when chunkSize exceeded the available watermark
        if (this.chunkSize > this.writableHighWaterMark) {
            fs.write(this.fd, Buffer.concat(this.chunks), (err) => {
                if (err) {
                    return callback(err);
                }
                this.chunks = [];
                this.chunkSize = 0;
                ++this.writesCount;
                callback();
            });
        } else {
            // if data does not exceed, give me more data.
            callback();
        }
    }

    _final(callback) {
        fs.write(this.fd, Buffer.concat(this.chunks), (error) => {
            if (error) {
                return callback(error);
            }

            this.chunks = [];
            ++this.writesCount;
            callback();
        })
    }

    // Calls after _finish callback is called
    _destroy(error, callback) {
        console.log("numbers of writes", this.writesCount);

        if (this.fd) {
            fs.close(this.fd, err => {
                callback(err || error);
            })
        } else {
            callback(error);
        }
    }
}



const stream = new FileWriteStream({ highWaterMark: 2, fileName: path.join(process.cwd(), "custome-writable", "data.txt") });



// stream.write("This is a some string");
// stream.end(Buffer.from(" Our last write"));



// stream.on("finish", () => {
//     console.log("stream finished");
// });


export default FileWriteStream;