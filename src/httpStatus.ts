/**
 * Status codes issued by a server in response to a client's request. 
 * All HTTP response status codes are separated into five classes or categories. The first digit of the status code defines the class of response, while the last two digits do not have any classifying or categorization role. There are five classes defined by the standard:
 *
 * - 1xx informational response – the request was received, continuing process
 * - 2xx successful – the request was successfully received, understood, and accepted
 * - 3xx redirection – further action needs to be taken in order to complete the request
 * - 4xx client error – the request contains bad syntax or cannot be fulfilled
 * - 5xx server error – the server failed to fulfil an apparently valid request
 *
 * @see https://en.wikipedia.org/wiki/List_of_HTTP_status_codes
 */
export enum HttpStatus {
    /**
     * Interim response indicates that everything so far is OK and that the client should continue with the request or ignore it if it is already finished.
     * @see https://http.cat/status/100
     */
    Continue100 = 100,
    
    /**
     * Sent in response to an Upgrade request header by the client, and indicates the protocol the server is switching too.
     * @see https://http.cat/status/101
     */
    SwitchingProtocols101 = 101,

    /**
     * Indicates that the server has received and is processing the request, but no response is available yet.
     * @see https://http.cat/status/102
     */
    Processing102 = 102,

    /**
     * The request has succeeded. The meaning of a success varies depending on the HTTP method:
     * GET: The resource has been fetched and is transmitted in the message body.
     * HEAD: The entity headers are in the message body.
     * POST: The resource describing the result of the action is transmitted in the message body.
     * TRACE: The message body contains the request message as received by the server
     * @see https://http.cat/status/200
     */
    OK200 = 200,

    /**
     * Request has succeeded and a new resource has been created as a result of it. This is typically the response sent after a PUT request.
     * @see https://http.cat/status/201
     */
    Created201 = 201,

    /**
     * Request has been received but not yet acted upon. It is non-committal, meaning that there is no way in HTTP to later send an asynchronous response indicating the outcome of processing the request. It is intended for cases where another process or server handles the request, or for batch processing.
     * @see https://http.cat/status/202
     */
    Accepted202 = 202,

    /**
     * There is no content to send for this request, but the headers may be useful. The user-agent may update its cached headers for this resource with the new ones.
     * @see https://http.cat/status/204
     */
    NoContent204 = 204,

    /**
     * Response code is sent after accomplishing request to tell user agent reset document view which sent this request.
     * @see https://http.cat/status/205
     */
    ResetContent205 = 205,

    /**
     * Response code is used because of range header sent by the client to separate download into multiple streams.
     * @see https://http.cat/status/206
     */
    PartialContent206 = 206,

    /**
     * Request has more than one possible responses. User-agent or user should choose one of them. There is no standardized way to choose one of the responses.
     * @see https://http.cat/status/300
     */
    MultipleChoices300 = 300,

    /**
     * Means that URI of requested resource has been changed. Probably, new URI would be given in the response.
     * @see https://http.cat/status/301
     */
    MovedPermanently301 = 301,

    /**
     * Means that URI of requested resource has been changed temporarily. New changes in the URI might be made in the future. Therefore, this same URI should be used by the client in future requests.
     * @see https://en.wikipedia.org/wiki/HTTP_302
     */
    Found302 = 302,

    /**
     * Server sent this response to directing client to get requested resource to another URI with an GET request.
     * @see https://http.cat/status/303
     */
    SeeOther303 = 303,

    /**
     * Used for caching purposes. It is telling to client that response has not been modified. So, client can continue to use same cached version of response.
     * @see https://http.cat/status/304
     */
    NotModified304 = 304,

    /**
     * @deprecated
     * Was defined in a previous version of the HTTP specification to indicate that a requested response must be accessed by a proxy. It has been deprecated due to security concerns regarding in-band configuration of a proxy.
     * @see https://http.cat/status/305
     */
    UseProxy305 = 305,

    /**
     * Server sent this response to directing client to get requested resource to another URI with same method that used prior request. This has the same semantic than the 302 Found HTTP response code, with the exception that the user agent must not change the HTTP method used: if a POST was used in the first request, a POST must be used in the second request.
     * @see https://http.cat/status/307
     */
    TemporaryRedirect307 = 307,

    /**
     * Means that the resource is now permanently located at another URI, specified by the Location: HTTP Response header. This has the same semantics as the 301 Moved Permanently HTTP response code, with the exception that the user agent must not change the HTTP method used: if a POST was used in the first request, a POST must be used in the second request.
     * @see https://http.cat/status/308
     */
    PermanentRedirect308 = 308,

    /**
     * Server could not understand the request due to invalid syntax.
     * @see https://http.cat/status/400
     */
    BadRequest400 = 400,

    /**
     * Although the HTTP standard specifies "unauthorized", semantically this response means "unauthenticated". That is, the client must authenticate itself to get the requested response.
     * @see https://http.cat/status/401
     */
    Unauthorized401 = 401,

    /**
     * Reserved for future use. Initial aim for creating this code was using it for digital payment systems however this is not used currently.
     * @see https://http.cat/status/402
     */
    PaymentRequired402 = 402,

    /**
     * Client does not have access rights to the content, i.e. they are unauthorized, so server is rejecting to give proper response. Unlike 401, the client's identity is known to the server.
     * @see https://http.cat/status/403
     */
    Forbidden403 = 403,

    /**
     * Server can not find requested resource. In the browser, this means the URL is not recognized. In an API, this can also mean that the endpoint is valid but the resource itself does not exist. Servers may also send this response instead of 403 to hide the existence of a resource from an unauthorized client.
     * @see https://http.cat/status/404
     */
    NotFound404 = 404,

    /**
     * Request method is known by the server but has been disabled and cannot be used. For example, an API may forbid DELETE-ing a resource. The two mandatory methods, GET and HEAD, must never be disabled and should not return this error code.
     * @see https://http.cat/status/405
     */
    MethodNotAllowed405 = 405,

    /**
     * Response is sent when the web server, after performing server-driven content negotiation, doesn't find any content following the criteria given by the user agent.
     * @see https://http.cat/status/406
     */
    NotAcceptable406 = 406,

    /**
     * Similar to 401 but authentication is needed to be done by a proxy.
     * @see https://http.cat/status/407
     */
    ProxyAuthenticationRequired407 = 407,

    /**
     * Response is sent on an idle connection by some servers, even without any previous request by the client. It means that the server would like to shut down this unused connection.
     * @see https://http.cat/status/408
     */
    RequestTimeout408 = 408,

    /**
     * Sent when a request conflicts with the current state of the server.
     * @see https://http.cat/status/409
     */
    Conflict409 = 409,

    /**
     * Response would be sent when the requested content has been permenantly deleted from server, with no forwarding address.
     * @see https://http.cat/status/410
     */
    Gone410 = 410,

    /**
     * Server rejected the request because the Content-Length header field is not defined and the server requires it.
     * @see https://http.cat/status/411
     */
    LengthRequired411 = 411,

    /**
     * Client has indicated preconditions in its headers which the server does not meet.
     * @see https://http.cat/status/412
     */
    PreconditionFailed412 = 412,

    /**
     * URI requested by the client is longer than the server is willing to interpret.
     * @see https://http.cat/status/413
     */
    PayloadTooLarge413 = 413,

    /**
     * Media format of the requested data is not supported by the server, so the server is rejecting the request.
     * @see https://http.cat/status/414
     */
    URITooLong414 = 414,

    /**
     * Media format of the requested data is not supported by the server.
     * @see https://http.cat/status/415
     */
    UnsupportedMediaType415 = 415,

    /**
     * Range specified by the Range header field in the request can't be fulfilled
     * @see https://http.cat/status/416
     */
    RangeNotSatisfiable416 = 416,

    /**
     * Response code means the expectation indicated by the Expect request header field can't be met by the server.
     * @see https://http.cat/status/417
     */
    ExpectationFailed417 = 417,

    /**
     * Any attempt to brew coffee with a teapot should result in the error code "418 I'm a teapot". The resulting entity body MAY be short and stout.
     * @see https://http.cat/status/418
     */
    ImATeapot418 = 418,

    /**
     * Defined in the specification of HTTP/2 to indicate that a server is not able to produce a response for the combination of scheme and authority that are included in the request URI.
     * @see https://http.cat/status/421
     */
    MisdirectedRequest421 = 421,

    /**
     * Request was well-formed but was unable to be followed due to semantic errors.
     * @see https://http.cat/status/422
     */
    UnprocessableEntity422 = 422,

    /**
     * The resource that is being accessed is locked.
     * @see https://http.cat/status/423
     */
    Locked423 = 423,

    /**
     * Request failed due to failure of a previous request.
     * @see https://http.cat/status/424
     */
    FailedDependency424 = 424,

    /**
     * 
     * @see https://http.cat/status/425
     */
    TooEarly425 = 425,

    /**
     * The server refuses to perform the request using the current protocol but might be willing to do so after the client upgrades to a different protocol.
     * @see https://http.cat/status/426
     */
    UpgradeRequired426 = 426,

    /**
     * The origin server requires the request to be conditional. Intended to prevent the 'lost update' problem, where a client GETs a resource's state, modifies it, and PUTs it back to the server, when meanwhile a third party has modified the state on the server, leading to a conflict.
     * @see https://http.cat/status/428
     */
    PreconditionRequired428 = 428,

    /**
     * User has sent too many requests in a given amount of time
     * @see https://http.cat/status/429
     */
    TooManyRequests429 = 429,

    /**
     * Server is unwilling to process the request because its header fields are too large.
     * @see https://http.cat/status/431
     */
    RequestHeaderFieldsTooLarge431 = 431,

    /**
     * User requested a resource that cannot legally be provided, such as a web page censored by a government.
     * @see https://en.wikipedia.org/wiki/HTTP_451
     */
    UnavailableForLegalReasons451 = 451,

    /**
     * Server encountered an unexpected condition that prevented it from fulfilling the request.
     * @see https://http.cat/status/500
     */
    InternalServerError500 = 500,

    /**
     * Request method is not supported by the server and cannot be handled
     * @see https://http.cat/status/501
     */
    NotImplemented501 = 501,

    /**
     * Server, while working as a gateway to get a response needed to handle the request, got an invalid response.
     * @see https://http.cat/status/502
     */
    BadGateway502 = 502,

    /**
     * Server is not ready to handle the request.
     * @see https://http.cat/status/503
     */
    ServiceUnavailable503 = 503,

    /**
     * Response is given when the server is acting as a gateway and cannot get a response in time.
     * @see https://http.cat/status/504
     */
    GatewayTimeout504 = 504,

    /**
     * HTTP version used in the request is not supported by the server.
     * @see https://http.cat/status/505
     */
    HTTPVersionNotSupported505 = 505,

    /**
     * Server has an internal configuration error: the chosen variant resource is configured to engage in transparent content negotiation itself, and is therefore not a proper end point in the negotiation process.
     * @see https://http.cat/status/506
     */
    VariantAlsoNegotiates506 = 506,

    /**
     * Indicates that a method could not be performed because the server cannot store the representation needed to successfully complete the request.
     * @see https://http.cat/status/507
     */
    InsufficientStorage507 = 507,

    /**
     * Indicates that the server terminated an operation because it encountered an infinite loop while processing a request
     * @see https://http.cat/status/508
     */
    LoopDetected508 = 508,

    /**
     * Sent in the context of the HTTP Extension Framework, defined in RFC 2774.
     * @see https://http.cat/status/510
     */
    NotExtended510 = 510,

    /**
     * Indicates that the client needs to authenticate to gain network access.
     * @see https://http.cat/status/511
     */
    NetworkAuthenticationRequired511 = 511,
}
