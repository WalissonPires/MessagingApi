import { DIContainer } from "../../common/di-container";
import { GetFileByHash } from "./queries/get-file-by-hash";
import { GetFileById } from "./queries/get-file-by-id";
import { FilesPrismaRepository } from "./repositories/files-prisma-repository";
import { FilesRepository } from "./repositories/files-repository";
import { SaveFile } from "./use-cases/save-file";


export default function diRegister() {

    DIContainer.addScoped(FilesPrismaRepository, 'filesRepository');
    DIContainer.addScoped(GetFileById, "getFileById");
    DIContainer.addScoped(GetFileByHash, "getFileByHash");
    DIContainer.addScoped(SaveFile, "saveFile");
}

export interface FileServices {
    filesRepository: FilesRepository;

    getFileById: GetFileById;
    saveFile: SaveFile;
    getFileByHash: GetFileByHash;
}