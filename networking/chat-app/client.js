import net from "net";
import readline from "readline/promises";

let id;
let socket;
let retry = 0
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
})


const reconnect = () => {
    while (retry <= 3) {
        setTimeout(() => {
            console.log("Retrying to Connect...")
            initSocketConnection();
            retry += 1;
        }, 3000)
    }
}


const clearLine = (dir) => {
    return new Promise((resolve, reject) => {
        process.stdout.clearLine(dir, () => {
            resolve();
        })
    })
}

const moveCursor = (dx, dy) => {
    return new Promise((resolve, reject) => {
        process.stdout.moveCursor(dx, dy, () => {
            resolve();
        })
    })
}


const ask = async () => {
    const message = await rl.question("Enter your message >");
    await moveCursor(0, -1)
    await clearLine(0);
    socket.write(`${id}-message-${message}`);
}

const initSocketConnection = () => {
    socket = net.createConnection({ host: "127.0.0.1", port: 8000 }, () => {
        try {
            console.log("New Connected to server!");
            retry = 0;
        }
        catch (e) {
            console.log("Connection failed!");
            process.exit()
        }
    })

    socket.on("data", async (data) => {
        console.log()
        await moveCursor(0, -1)
        await clearLine(0);
        if (data.toString("utf-8").substring(0, 2) === "id") {
            id = data.toString("utf-8").substring(3);
            console.log(`Your id is ${id}!`);
        } else {
            console.log(data.toString("utf-8"));
        }
        ask();
    })

    socket.on("error", () => {
        console.log("client error");
        reconnect();
    });

    socket.on("close", (hadError) => {
        console.log(hadError ? "client closed the connection" : "client closed");
        reconnect();
    });

    socket.on("end", () => {
        console.log("client end")
    });

};

initSocketConnection();
