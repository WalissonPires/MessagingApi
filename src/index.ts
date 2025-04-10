import 'dotenv/config';
import { Server } from "./server";

(async () => {

    try {
        const server = new Server();
        await server.listen();
    }
    catch(error) {
        console.error((error as any)?.message);
        process.exit(1);
    }

    process.on('unhandledRejection', async (reason, promise) => {

        console.log('Unhandled Error: ', reason);

        const whiteListError = [
            'Execution context was destroyed',
        ];
        const errorMessage = reason instanceof Error ? reason.message : String(reason);

        if (whiteListError.includes(errorMessage)) {
            return;
        }
        process.exit(1);
    });

})();