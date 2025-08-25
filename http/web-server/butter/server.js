import Butter from "./index.js";
import path from "path";

const users = [
    { id: 1, name: "Amir", username: "amir@2", password: "string" }
];
const posts = [{
    id: 1,
    title: "This is post title",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
    userId: 1
},
{
    id: 2,
    title: "This is post title 2",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt  qui officia deserunt mollit anim id est laborum",
    userId: 1
},
{
    id: 3,
    title: "This is post title 3",
    body: "Lorem ipsum dolor sit amet, consectetur adipisci sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
    userId: 1
}]



const PORT = 9000;

const server = new Butter();




server.route("get", "/", (req, res) => {
    const filePath = path.join(process.cwd(), "..", "public", "index.html");
    res.statusCode(200).sendFile(filePath, "text/html");
})

server.route("get", "/style.css", (req, res) => {
    const filePath = path.join(process.cwd(), "..", "public", "style.css");
    res.statusCode(200).sendFile(filePath, "text/css");
})

server.route("get", "/script.js", (req, res) => {
    const filePath = path.join(process.cwd(), "..", "public", "script.js");
    res.statusCode(200).sendFile(filePath, "text/javascript");
})

server.route("get", "/api/posts", (req, res) => {

    const postList = posts.map((post) => {
        const user = users.find(user => user.id === post.userId)
        post.author = user.username || "";
        return post;
    })
    res.statusCode(200).json(postList);
})

server.listen(PORT, () => {
    console.log("Listening to port 9000");
})