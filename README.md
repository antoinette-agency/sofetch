<img alt="soFetchReadmeHeader" src="https://private-user-images.githubusercontent.com/4609705/502680503-04f98633-3584-4b5a-8d8a-6d470ad12285.png?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NjA3MjE2NjgsIm5iZiI6MTc2MDcyMTM2OCwicGF0aCI6Ii80NjA5NzA1LzUwMjY4MDUwMy0wNGY5ODYzMy0zNTg0LTRiNWEtOGQ4YS02ZDQ3MGFkMTIyODUucG5nP1gtQW16LUFsZ29yaXRobT1BV1M0LUhNQUMtU0hBMjU2JlgtQW16LUNyZWRlbnRpYWw9QUtJQVZDT0RZTFNBNTNQUUs0WkElMkYyMDI1MTAxNyUyRnVzLWVhc3QtMSUyRnMzJTJGYXdzNF9yZXF1ZXN0JlgtQW16LURhdGU9MjAyNTEwMTdUMTcxNjA4WiZYLUFtei1FeHBpcmVzPTMwMCZYLUFtei1TaWduYXR1cmU9Y2JhNjYwNjUwOGFhNDYyYTExMGEwZjdhMzVkZDZiMzQ4MTliMTJhMzU0OTYzMTNiNDNmMTRjMGZlZDAyYWM5ZCZYLUFtei1TaWduZWRIZWFkZXJzPWhvc3QifQ.yZx0LCVkbZf-E67OQOc_9XSoXatTzJGSlWQfai69Ces" />

<p align="center">
  <a href="https://sofetch.antoinette.agency/#quickstart">Quick Start</a> | 
  <a href="https://sofetch.antoinette.agency/examples">Examples</a> |
  <a href="https://sofetch.antoinette.agency/api-reference">API</a> |
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
    .catchHttp(404, (res:Response) => {
        alert("This unicorn can't be found")
    })
```

<div style="text-align: center">
    <img style="margin-top: 3rem; margin-bottom: 3rem; display: inline-block; width: 70%" alt="So Fetch Meme" src="https://github.com/user-attachments/assets/5a1968a0-d72a-42a3-8fb3-8a1de9b467c1" />
</div>