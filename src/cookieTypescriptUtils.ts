export function getCookie(name: string, documentCookie?:string) {
    if (typeof(document) === "undefined" && !documentCookie) {
        return;
    }
    const value = documentCookie || document.cookie;
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
