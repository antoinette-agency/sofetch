/**
 * Classifies the desired action to be performed on a resource.
 * - GET The request is for a representation of a resource. The server should only retrieve data; not modify state.
 * - POST The request is to process a resource in some way.
 * - PUT The request is to create or update a resource with the state in the request. A distinction from POST is that the client specifies the target location on the server.
 * - PATCH The request is to modify a resource according to its partial state in the request.
 * - DELETE The request is to delete a resource.
 */
export type RequestMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE"