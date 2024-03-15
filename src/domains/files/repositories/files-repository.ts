import { FileMeta } from "../entities/file-meta";


export interface FilesRepository {

    insert(fileMeta: FileMeta): Promise<void>;
    insertAccountBind(args: { accountId: number, fileId: number }): Promise<void>;
}