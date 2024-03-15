import { File as FileDb } from "@prisma/client";
import { FileMeta, FileMetaView1 } from "../entities/file-meta";


export class FileMapper {

    public static map(file: FileDb): FileMeta {

        return new FileMeta({
            id: file.id,
            name: file.name,
            mimeType: file.mimeType,
            size: file.size,
            hash: file.hash,
            data: file.data
        });
    }

    public static mapView1FromFileDb(file: Omit<FileDb, 'data'>): FileMetaView1 {

        return new FileMetaView1({
            id: file.id,
            name: file.name,
            mimeType: file.mimeType,
            size: file.size,
            hash: file.hash
        });
    }

    public static mapView1FromFileMeta(file: FileMeta): FileMetaView1 {

        return new FileMetaView1({
            id: file.id,
            name: file.name,
            mimeType: file.mimeType,
            size: file.size,
            hash: file.hash
        });
    }
}