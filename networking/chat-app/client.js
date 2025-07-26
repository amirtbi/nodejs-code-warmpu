import net from "net";

const client = net.createConnection({ host: "127.0.0.1", port: 8000 }, () => {
    console.log("Connected to the server!")
})



client.on("error", () => {
    console.log("had error")
});

client.on("close", (hadError) => {
    console.log(hadError ? "Error closed the connection" : "closed");
});

client.on("end", () => {
    console.log("Ended")
});