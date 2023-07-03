import 'dotenv/config';
import { Server } from "./server";

(async () => {

    try {
        const server = new Server();
        await server.listen();
    }
    catch(error) {
        console.error(error.message);
        process.exit(1);
    }

})();