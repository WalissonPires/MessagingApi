import { PrismaClient } from "@prisma/client";
import { DatabaseServices } from "../../../database/di-register";
import { IQuery } from "../../../common/queries";
import { UserIdentity } from "../../auth/entities";
import { AuthServices } from "../../auth/di-register";
import { FileMeta } from "../entities/file-meta";
import { FileMapper } from "./file-mapper";


export class GetFileByHash implements IQuery<GetFileByHashInput, FileMeta | null> {

    private readonly _user: UserIdentity;
    private readonly _db: PrismaClient;

    constructor({ user, prismaClient }: AuthServices & DatabaseServices) {

        this._user = user;
        this._db = prismaClient;
    }

    public async execute(input: GetFileByHashInput): Promise<FileMeta | null> {

        const fileDb = await this._db.file.findFirst({
            where: {
                hash: input.fileHash
            }
        });

        if (!fileDb) return null;

        return FileMapper.map(fileDb);
    }

}

export interface GetFileByHashInput {
    fileHash: string;
}