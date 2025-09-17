export const makeFile = (str: string, filename: string) => {
    return new File([str], filename, {
        type: "text/plain",
    });
}