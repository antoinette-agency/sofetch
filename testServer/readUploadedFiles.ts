import {IncomingMessage} from "http";
import Busboy from "busboy";

/**
 * Reads uploaded files from a request using busboy
 * @param req - The incoming request
 * @returns Promise<Buffer[]> - Resolves to an array of file contents
 */
export function readUploadedFiles(req: IncomingMessage): Promise<{
    fieldname: string,
    filename: string,
    contents: string
}[]> {
    return new Promise((resolve, reject) => {
            try {
                const busboy = Busboy({headers: req.headers});
                const files: { fieldname: string, filename: string, contents: string }[] = [];

                busboy.on("file", (fieldname, file, fileinfo) => {
                    const chunks: Buffer[] = [];

                    file.on("data", (data: Buffer) => {
                        chunks.push(data);
                    });

                    file.on("end", () => {
                        console.log('ENDING' +
                            '')
                        files.push({
                            fieldname,
                            filename: fileinfo.filename,
                            contents: Buffer.concat(chunks).toString("utf8")
                        });
                    });

                    busboy.on("error", reject);

                    busboy.on("finish", () => {
                        console.log('FINISHING')
                        resolve(files);
                    });

                    req.pipe(busboy);
                })
            } catch (err) {
                reject(err);
            }
        }
    )
}
