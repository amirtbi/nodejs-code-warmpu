import http from "http";
import fs from "fs";

class Butter {

    constructor() {
        this.server = http.createServer();
        this.routes = {};
        this.statusCode;

        this.server.on("request", (request, response) => {


            response.statusCode = (code) => {
                response.statusCode = code;
                return response;
            }

            response.sendFile = (path, mime) => {
                const fileStream = fs.createReadStream(path);
                response.setHeader("Content-Type", mime);
                fileStream.pipe(response);
            }

            response.json = (objectData) => {
                response.setHeader("Content-type", "application/json");
                response.end(JSON.stringify(objectData));
                return response
            }


            if (!this.routes[request.method.toLowerCase() + request.url]) {
                response.statusCode(400).json({ message: "Route not found" });
                return response;
            }

            this.routes[request.method.toLowerCase() + request.url](request, response);

        })
    }

    listen(port, cb) {
        this.server.listen(port, () => {
            cb();
        });
    }

    statusCode(code) {
        this.statusCode = code;
    }

    route(method, path, cb) {
        this.routes[method + path] = cb;
    }
}

export default Butter;