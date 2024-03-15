import { PrismaClient } from "@prisma/client";
import { DatabaseServices } from "../../../database/di-register";
import { FileMeta } from "../entities/file-meta";
import { UserIdentity } from "../../auth/entities";
import { AuthServices } from "../../auth/di-register";
import { FilesRepository } from "./files-repository";


export class FilesPrismaRepository implements FilesRepository {

    private readonly _user: UserIdentity;
    private readonly _db: PrismaClient;

    constructor({ user, prismaClient }: AuthServices & DatabaseServices) {

        this._user = user;
        this._db = prismaClient;
    }

    public async insert(file: FileMeta): Promise<void> {

        const result = await this._db.accountFile.create({
            data: {
                account: {
                    connect: { id: this._user.accountId }
                },
                file: {
                    create: {
                        name: file.name,
                        mimeType: file.mimeType,
                        size: file.size,
                        hash: file.hash,
                        data: file.data
                    }
                }
            }
        });

        file.id = result.fileId;
    }

    public async insertAccountBind(args: { accountId: number; fileId: number; }): Promise<void> {

        const accountFileDb = await this._db.accountFile.findFirst({
            where: {
                accountId: args.accountId,
                fileId: args.fileId
            }
        });

        if (accountFileDb)
            return;

        await this._db.accountFile.create({
            data: {
                accountId: args.accountId,
                fileId: args.fileId
            }
        });
    }
}