import { createServer } from "http";
import {IncomingMessage} from "node:http";

interface Route {
    url:string,
    staticResponse?:any
    handler?:(req:IncomingMessage) => any
    status?:number
}

const routes:Route[] = [
    {
        url:"/ping"
    },
    {
        url:"/getJson",
        staticResponse:{ message: "Hello from TypeScript!" }
    }
]

const server = createServer((req, res) => {
    const route = routes.find(x => x.url === req.url) 
    if (route) {
        const status = route.status || 200
        res.writeHead(status, { "Content-Type": "application/json" })
        if (route.staticResponse) {
            res.end(JSON.stringify(route.staticResponse))
        } else if (route.handler) {
            res.end(route.handler(req))
        } else {
            res.end()
        }
    } else {
        res.writeHead(404);
        res.end("Not found");
    }
});

server.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});