import { IncomingMessage } from "http";
import Busboy, {FileInfo} from "busboy";
import Stream = require("node:stream");

export interface UploadedFile {
    fieldName: string;
    filename: string;
    encoding: string;
    mimetype: string;
    contents: string;
}

export interface FormDataResult {
    files: UploadedFile[];
    fields: Record<string, string>;
}

/**
 * Reads uploaded files + form fields from a request using busboy
 * @param req - The incoming HTTP request
 * @returns Promise<FormDataResult>
 */
export function readFormData(req: IncomingMessage): Promise<FormDataResult> {
    return new Promise((resolve, reject) => {
        try {
            const busboy = Busboy({ headers: req.headers });
            const files: UploadedFile[] = [];
            const fields: Record<string, string> = {};

            busboy.on(
                "file",
                (fieldname:string, file: Stream.Readable, filename:FileInfo, encoding:string, mimetype:string) => {
                    const chunks: Buffer[] = [];

                    file.on("data", (data: Buffer) => {
                        chunks.push(data);
                    });

                    file.on("end", () => {
                        files.push({
                            fieldName:fieldname,
                            filename:filename.filename,
                            encoding,
                            mimetype,
                            contents: Buffer.concat(chunks).toString('utf8'),
                        });
                    });
                }
            );

            busboy.on("field", (fieldname, val, info) => {
                if (info.mimeType === "application/json") {
                    try {
                        fields[fieldname] = JSON.parse(val);
                    } catch {
                        fields[fieldname] = val; // fallback to raw string if parsing fails
                    }
                } else {
                    fields[fieldname] = val;
                }
            });

            busboy.on("error", reject);

            busboy.on("finish", () => {
                resolve({ files, fields });
            });

            req.pipe(busboy);
        } catch (err) {
            reject(err);
        }
    });
}
