import soFetch from "../../src/soFetch";
import {BaseTestUrl} from "./baseTestUrl";
import {makeFile} from "./make.file";

describe("Sending files with SoFetch", () => {
    it('can POST an array of files', async () => {
        const files = [
            makeFile("contents1", "file1.txt"),
            makeFile("contents2", "file2.txt")
        ]
        const result = await soFetch(`${BaseTestUrl}/files`, files)
        expect(result).toStrictEqual([
            {
                "fieldName": "file0",
                "filename": "file1.txt",
                "contents": "contents1"
            },
            {
                "fieldName": "file1",
                "filename": "file2.txt",
                "contents": "contents2"
            }
        ])
    })
    it('can POST a single file', async() => {
        const result = await soFetch(`${BaseTestUrl}/files`, makeFile("contents1", "file1.txt"))
        expect(result).toStrictEqual([
            {
                "fieldName": "file0",
                "filename": "file1.txt",
                "contents": "contents1"
            }
        ])
    })
    it('can POST a single file with fieldname', async() => {
        const fileWithFieldname = {
            file:makeFile("contents1", "file1.txt"),
            fieldName:"some_field_name"
        }
        const result = await soFetch(`${BaseTestUrl}/files`, fileWithFieldname)
        expect(result).toStrictEqual([
            {
                "fieldName": "some_field_name",
                "filename": "file1.txt",
                "contents": "contents1"
            }
        ])
    })
    it('can POST an array of files with fieldnames', async() => {
        const fileWithFieldname = {
            file:makeFile("contents1", "file1.txt"),
            fieldName:"some_field_name"
        }
        const fileWithFieldname2 = {
            file:makeFile("contents2", "file2.txt"),
            fieldName:"some_field_name_2"
        }
        const result = await soFetch(`${BaseTestUrl}/files`, [fileWithFieldname, fileWithFieldname2])
        expect(result).toStrictEqual([
            {
                "fieldName": "some_field_name",
                "filename": "file1.txt",
                "contents": "contents1"
            },
            {
                "fieldName": "some_field_name_2",
                "filename": "file2.txt",
                "contents": "contents2"
            }
        ])
    })
    it('Can modify the fetch RequestInit via the SoFetchPromise beforeFetchSend interceptor to send files and data simultaneously', done => {
        const file1 = makeFile("Contents1","file1.txt")
        const file2 = makeFile("Contents2","file2.txt")
        
        const promise = soFetch.put<any>(`${BaseTestUrl}/files/filesAndData`).beforeFetchSend((init:RequestInit) => {
            const formData = new FormData()
            formData.append("username", "chris");
            formData.append("company", "Antoinette");
            formData.append("file1", file1)
            formData.append("file2", file2)
            const headers = {...init.headers} as Record<string,string>
            if (headers["content-type"]) {
                delete headers["content-type"]
            }
            init.body = formData
            init.headers = headers
            return init
        })
        promise.then(response => {
            expect(response).toStrictEqual({
                files: [
                    {
                        fieldName: 'file1',
                        filename: 'file1.txt',
                        contents: 'Contents1'
                    },
                    {
                        fieldName: 'file2',
                        filename: 'file2.txt',
                        contents: 'Contents2'
                    }
                ],
                fields: { username: 'chris', company: 'Antoinette' }
            })
            done()
        })
    })
})