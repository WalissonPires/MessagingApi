import { PrismaClient } from "@prisma/client";
import { DatabaseServices } from "../../../database/di-register";
import { IQuery } from "../../../common/queries";
import { UserIdentity } from "../../auth/entities";
import { AuthServices } from "../../auth/di-register";
import { FileMeta } from "../entities/file-meta";
import { FileMapper } from "./file-mapper";


export class GetFileById implements IQuery<GetFileByIdInput, FileMeta | null> {

    private readonly _user: UserIdentity;
    private readonly _db: PrismaClient;

    constructor({ user, prismaClient }: AuthServices & DatabaseServices) {

        this._user = user;
        this._db = prismaClient;
    }

    public async execute(input: GetFileByIdInput): Promise<FileMeta | null> {

        const accountFileDb = await this._db.accountFile.findFirst({
            where: {
                accountId: this._user.accountId,
                fileId: input.fileId
            },
            include: {
                file: true
            }
        });

        if (!accountFileDb) return null;

        return FileMapper.map(accountFileDb.file);
    }

}

export interface GetFileByIdInput {
    fileId: number;
}