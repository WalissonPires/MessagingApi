

export class FileMeta implements FileMetaProps {
    id: number;
    name: string;
    mimeType: string;
    size: number;
    hash: string;
    data: Buffer;

    constructor(props: FileMetaProps) {
        this.id = props.id;
        this.name = props.name;
        this.mimeType = props.mimeType;
        this.size = props.size;
        this.hash = props.hash;
        this.data = props.data;
    }
}

export interface FileMetaProps {
    id: number;
    name: string;
    mimeType: string;
    size: number;
    hash: string;
    data: Buffer;
}

export class FileMetaView1 implements Omit<FileMetaProps, 'data'> {
    id: number;
    name: string;
    mimeType: string;
    size: number;
    hash: string;

    constructor(props: Omit<FileMetaProps, 'data'>) {
        this.id = props.id;
        this.name = props.name;
        this.mimeType = props.mimeType;
        this.size = props.size;
        this.hash = props.hash;
    }
}