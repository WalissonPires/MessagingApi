import * as fs from "fs";

export class Storage {

    public save(session: SessionData): Promise<void> {

        console.log('save', { session });
        fs.writeFileSync(this.getFilename(session.session), JSON.stringify(session));
        return Promise.resolve();
    }

    public delete(session: SessionData): Promise<void> {

        console.log('delete', { session });
        fs.rmSync(this.getFilename(session.session));
        return Promise.resolve();
    }

    public sessionExists(session: SessionData): Promise<boolean> {

        console.log('exists', { session });
        return Promise.resolve(fs.existsSync(this.getFilename(session.session)));
    }

    public extract(session: SessionData): Promise<void> {

        console.log('extract', { session });
        const sessionJson = fs.readFileSync(this.getFilename(session.session), 'utf8');
        const sessionData = JSON.parse(sessionJson);
        return Promise.resolve(sessionData);
    }


    private getFilename(sessionId: string) {

        const filename = './out/wp-session/' + sessionId;
        return filename;
    }
}

export interface SessionData {
    session: string;
    [key: string]: any;
}