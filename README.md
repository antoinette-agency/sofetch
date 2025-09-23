<img alt="So Fetch Meme" src="https://github.com/user-attachments/assets/5a1968a0-d72a-42a3-8fb3-8a1de9b467c1" />

## `soFetch` is a concise, elegant wrapper around the Fetch API

### 🌱 Install

```
npm i ludd-industries/so-fetch
```

### ⏩ Quickstart

```typescript

import soFetch from "so-fetch";

//GET Request:
const products = await soFetch<Product[]>("/api/products")

//POST Rquest:
const newUser = {
    name:"Regina George", 
    email:"regina@massive-deal.com"
}
const successResponse = await soFetch<Success>("/api/users", newUser)

//Handling errors
const unicorn = await soFetch<Unicorn>("/api/unicorns/1234")
    .catchHttp(404, (res:Response) => {
        alert("This unicorn can't be found")
    })
```