import { EventEmitter } from "./events.js";

class Emitter extends EventEmitter { };

const appEventEmitter = new Emitter();

let count = 0

appEventEmitter.once("hello", () => {
    count += 1;
    console.log("received hello", count);
});

appEventEmitter.on("foo", (x) => {
    console.log("receiving foo", x);
})

appEventEmitter.emit("hello");
appEventEmitter.emit("hello");
appEventEmitter.emit("hello");
appEventEmitter.emit("hello");
appEventEmitter.emit("foo", "2")