import { Duplex } from "stream";
import fs from "fs";


class DuplexStream extends Duplex {
    constructor({ writableHighWaterMark, readableHighWaterMark, readFileName, writeFileName }) {
        super({ writableHighWaterMark, readableHighWaterMark });
        this.writeFileName = writeFileName;
        this.readFileName = readFileName;
        this.writeFd = null;
        this.readFd = null;
        this.chunks = [];
        this.chunkSize = 0;
        this.readPosition = 0;

    }

    _construct(callback) {
        fs.open(this.readFileName, "r", (err, readFd) => {
            if (err) return callback(err);
            this.readFd = readFd;
            fs.open(this.writeFileName, "w", (wError, wFd) => {
                if (wError) return callback(wError);
                this.writeFd = wFd;
                callback();
            })
        })
    }

    _write(chunk, encoding, callback) {
        this.chunks.push(chunk);
        this.chunkSize += chunk.length;
        if (this.chunkSize > this.writableHighWaterMark) {
            fs.write(this.writeFd, Buffer.concat(this.chunks), (err) => {
                if (err) return callback(err);
                this.chunks = [];
                this.chunkSize = 0;
                callback();
            })
        } else {
            callback();
        }
    }

    _read(size) {
        const buff = Buffer.alloc(size);
        fs.read(this.readFd, buff, 0, size, this.readPosition, (err, bytesRead) => {
            if (err) this.destroy(err);
            if (bytesRead > 0) {
                this.push(buff.subarray(0, bytesRead));
                this.readPosition += bytesRead;
            } else {
                this.push(null);
            }
        })
    }

    _final(callback) {
        fs.write(this.writeFd, Buffer.concat(this.chunks), (err) => {
            if (err) return callback(err);
            this.chunks = [];
            this.chunkSize = 0;
            callback();
        })
    }

    _destroy(error, callback) {
        const closeRead = (cb) => this.readFd ? fs.close(this.readFd, cb) : cb();
        const closeWrite = (cb) => this.writeFd ? fs.close(this.writeFd, cb) : cb();

        closeRead((readErr) => {
            closeWrite((writeErr) => {
                callback(error || readErr || writeErr);
            });
        });
    }
}

const duplex = new DuplexStream({ writableHighWaterMark: 1800, readableHighWaterMark: 1800, readFileName: "data.txt", writeFileName: "write.txt" });


duplex.write(Buffer.from("this is something new\n"));
duplex.on("data", (chunk) => {
    console.log("chunk", chunk.toString("utf-8"))
})
duplex.end("this is end");

