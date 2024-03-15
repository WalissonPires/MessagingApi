import { Hash } from "../../../../common/crypto/hash";
import { UseCase } from "../../../../common/use-cases";
import { AuthServices } from "../../../auth/di-register";
import { UserIdentity } from "../../../auth/entities";
import { FileServices } from "../../di-register";
import { FileMeta, FileMetaView1 } from "../../entities/file-meta";
import { FileMapper } from "../../queries/file-mapper";
import { GetFileByHash } from "../../queries/get-file-by-hash";
import { FilesRepository } from "../../repositories/files-repository";

export class SaveFile implements UseCase<SaveFileInput, FileMetaView1> {

    private _user: UserIdentity;
    private _filesRepository: FilesRepository;
    private _getFileByHash: GetFileByHash;

    constructor({ user, filesRepository, getFileByHash }: AuthServices & FileServices) {

        this._user = user;
        this._filesRepository = filesRepository;
        this._getFileByHash = getFileByHash;
    }

    public async execute(input: SaveFileInput): Promise<FileMetaView1> {

        const fileHash = Hash.generate(input.fileMeta.data);

        let fileMeta = await this._getFileByHash.execute({ fileHash });

        if (fileMeta != null) {

            await this._filesRepository.insertAccountBind({
                accountId: this._user.accountId,
                fileId: fileMeta.id
            });

            return FileMapper.mapView1FromFileMeta(fileMeta);
        }

        fileMeta = new FileMeta({
            id: 0,
            name: input.fileMeta.name,
            mimeType: input.fileMeta.mimeType,
            size: input.fileMeta.size,
            hash: fileHash,
            data: input.fileMeta.data
        });

        await this._filesRepository.insert(fileMeta);

        return FileMapper.mapView1FromFileMeta(fileMeta);
    }
}

export interface SaveFileInput {
    fileMeta: Pick<FileMeta, 'name' | 'mimeType' | 'size' | 'data'>;
}