<img width="1280" height="720" alt="So Fetch Meme" src="https://github.com/user-attachments/assets/5a1968a0-d72a-42a3-8fb3-8a1de9b467c1" />
<div style="text-align: center; font-weight: bold">
An opinionated, elegant wrapper around the Fetch API
</div>

### Quickstart

```typescript

//GET request:
const products = await soFetch<Product[]>("/api/products")

//POST request:
const newUser = {
    name:"Alice", 
    email:"alice@antoinette.agency"
}
const successResponse = await soFetch<Success>("/api/users", newUser)

```