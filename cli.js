import fs from "fs";
import path from "path";

console.log(process.argv)

const [, , ...args] = process.argv;


const sourceFile = path.resolve(process.cwd(), args[0]);
const destinationFile = path.resolve(process.cwd(), "data.json");

const readStream = fs.createReadStream(sourceFile, "utf-8");
const writableStream = fs.createWriteStream(destinationFile, { encoding: "utf-8" });





function createJson() {
    let buffer;
    let dataObject = {};

    readStream.on("data", (chunk) => {

        buffer += chunk;

    })

    writableStream.on("drain", () => {
        readStream.resume();
    });

    writableStream.on("finish", () => {
        console.log("writing ended");
    });

    readStream.on("end", () => {

        const number = buffer.replace(/\r?\n/g, ',').split(",");

        number.forEach((number, i) => {
            dataObject[i++] = Number(number);
        });

        if (!writableStream.write(JSON.stringify(dataObject, 0, 2))) {
            readStream.pause();
        }

        writableStream.end();
    })

}

createJson();