/*
 * General utils for managing cookies in Typescript.
 */

export function getCookie(name: string) {
    if (typeof(document) === "undefined") {
        return;
    }
    const value = document.cookie;
    const cookies = value.split("; ");
    const cookieEntries = cookies.map(c => {
        const parts = c.split("=")
        return {
            key:parts[0],
            value:parts[1]
        }
    })
    const cookie = cookieEntries.find(x => x.key === name)
    return cookie?.value
}
