import { createHash } from 'crypto';

export class Hash {

    public static generate(data: Buffer) {

        const hash = createHash('md5').update(data).digest('hex');
        return hash;
    }
}