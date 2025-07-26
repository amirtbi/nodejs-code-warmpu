import net from "net";
import readline from "readline/promises";


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})


const reconnect = () => {
    setTimeout(() => {
        console.log("Retrying to Connect...")
        initSocketConnection();
    }, 10000)
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


const ask = async (socket) => {
    const message = await rl.question("Enter your message >");
    await moveCursor(0, -1)
    await clearLine(0);
    socket.write(message);
}

const initSocketConnection = () => {

    const socket = net.createConnection({ host: "127.0.0.1", port: 8000 }, async () => {
        console.log("Connected to the server!");

        try {
            ask(socket);
        }
        catch (e) {
            console.log("Error during writing cline message")
        }

    });



    socket.on("data", (msg) => {
        console.log(msg.toString("utf-8"));
        ask(socket)
    })

    socket.on("error", () => {
        console.log("had error");
        reconnect();
    });

    socket.on("close", (hadError) => {
        console.log(hadError ? "Error closed the connection" : "closed");
        reconnect();
    });

    socket.on("end", () => {
        console.log("Ended")
    });

}

initSocketConnection();