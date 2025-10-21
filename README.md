<a href="https://sofetch.antoinette.agency">
   <img alt="soFetchReadmeHeader" src="https://github.com/user-attachments/assets/ac1fed39-cdc4-4773-96fd-53d91f82dd81" />
</a>
<p align="center">
  <a href="https://sofetch.antoinette.agency/#quickstart">Quick Start</a> | 
  <a href="https://sofetch.antoinette.agency/examples">Examples</a> |
  <a href="https://sofetch.antoinette.agency/api-reference">API</a>
</p>

### ✨ Features

- Elegant interface. Less code. Minimal boilerplate
- Serialise request ➡️ Post request ➡️ Serialise response with 1 line of code
- Fluent error handling
- Easy authentication
- Build multiple clients effortlessly

### 🌱 Install

```
npm i @antoinette-agency/sofetch
```

### ⏩ Quickstart

```typescript

import soFetch from "@antoinette-agency/sofetch";

//GET Request:
const products = await soFetch<Product[]>("/api/products")

//POST Request:
const newUser = {
    name:"Regina George", 
    email:"regina@massive-deal.com"
}
const successResponse = await soFetch<Success>("/api/users", newUser)

//Handling errors
const unicorn = await soFetch<Unicorn>("/api/unicorns/1234")
    .catchHttp(HttpStatus.NotFound404, (res:Response) => {
        alert("This unicorn can't be found")
    })
```


<p align="center" style="text-align: center">
    <img width="400" style="margin-top: 3rem; margin-bottom: 3rem; display: inline-block;" alt="So Fetch Meme" src="https://github.com/user-attachments/assets/5a1968a0-d72a-42a3-8fb3-8a1de9b467c1" />
</p>
