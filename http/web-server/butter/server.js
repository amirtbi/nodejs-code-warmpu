import Butter from "./index.js";
import path from "path";

const butter = new Butter();


butter.route("get", "/", (req, res) => {
    const filePath = path.join(process.cwd(), "..", "public", "index.html");
    res.statusCode(200).sendFile(filePath, "text/html");
})

butter.route("post", "/login", (req, res) => {

    res.statusCode(200).json({ message: "login successfully" })
})

butter.route("get", "/style.css", (req, res) => {
    const filePath = path.join(process.cwd(), "..", "public", "style.css");
    res.statusCode(200).sendFile(filePath, "text/css");
})


butter.route("get", "/script.js", (req, res) => {
    const filePath = path.join(process.cwd(), "..", "public", "script.js");
    res.statusCode(200).sendFile(filePath, "text/javascript");
})

butter.listen(9000, () => {
    console.log("Listening to port 9000")
})