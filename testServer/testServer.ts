import { createServer } from "http";
import {IncomingMessage} from "node:http";

function getRequestBody(req:IncomingMessage):Promise<string> {
    return new Promise<string>((resolve, reject) => {
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            try {
                resolve(body);
            } catch (err) {
                reject(err);
            }
        });

        req.on('error', reject);
    });
}

interface Route {
    url:string,
    staticResponse?:any
    headers?:{ [key: string]: string }
    handler?:(req:IncomingMessage) => Promise<any>
    status?:number
}

const routes:Route[] = [
    {
        url:"/ping"
    },
    {
        url:"/getting-started/get-string",
        staticResponse:"String result"
    },
    {
        url:"/getting-started/get-number",
        staticResponse:42
    },
    {
        url:"/getting-started/get-boolean",
        staticResponse:true
    },
    {
        url:"/getting-started/get-empty-result"
    },
    {
        url:"/getting-started/get-poco",
        staticResponse:{
            str:"string",
            num:42,
            array: [1,2,3,4,5],
            child: {
                str:"string2",
                num:43,
                array:[9,8,7,6,5]
            }
        }
    },
    {
        url:"/return-method-and-body",
        handler:async req => {
            const body = await getRequestBody(req)
            if (!body) {
                return {method:req.method}
            }
            return {method:req.method, body:JSON.parse(body)}
        }
    },
    {
        url:"/reading-headers/get-header",
        headers:{
            "soFetch-TestHeader":"A string value"
        },
        staticResponse:"A string result"
    },
    {
        url:"/handling-errors",
        status:400
    },
    {
        url:"/interceptors/beforeSend",
        handler:async req => {
            return {headers:req.headers}
        }
    },
    {
        url:"/authentication/basic",
        handler:async req => {
            const authHeader = req.headers.authorization || ""
            const token = atob(authHeader.split(" ").pop() || "")
            const parts = token.split(":")
            const username = parts[0] || ""
            const password = parts[1] || ""
            return {username, password}
        }
    },
    {
        url:"/authentication/bearerToken",
        handler:async req => {
            const authHeader = req.headers.authorization || ""
            const token = authHeader.split(" ").pop()
            return {token}
        }
    },
    {
        url:"/authentication/headerApiKey",
        handler:async req => {
            const value = req.headers["api-key"]
            return {headerName:"api-key", value}
        }
    },
    {
        url:"/authentication/querystringApiKey?api-key=QUERY_STRING_ACCESS_TOKEN",
        handler:async req => {
            const url = new URL(`http://localhost:3000${req.url}`)
            const value = url.searchParams.get("api-key")
            return {paramName:"api-key", value}
        }
    }
]

const server = createServer(async (req, res) => {
    const route = routes.find(x => x.url === req.url) 
    if (route) {
        const status = route.status || 200
        res.writeHead(status, { 
            "Content-Type": "application/json",
            ...route.headers
        })
        if (route.staticResponse) {
            res.end(JSON.stringify(route.staticResponse))
        } else if (route.handler) {
            const response = await route.handler(req)
            res.end(JSON.stringify(response))
        } else {
            res.end()
        }
    } else {
        const responseBody = {
            url:req.url,
            method:req.method
        }
        res.writeHead(404, { "Content-Type": "application/json" })
        res.end(JSON.stringify(responseBody));
    }
});

server.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});