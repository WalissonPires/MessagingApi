import { createHash } from 'crypto';

export class Hash {

    public static generateMd5(data: Buffer) {

        const hash = createHash('md5').update(data).digest('hex');
        return hash;
    }

    public static generateSha256(data: Buffer | string) {
        const buffer = typeof data === 'string' ? Buffer.from(data, 'utf-8') : data;
        const hash = createHash('sha256').update(buffer).digest('hex');
        return hash;
    }
}