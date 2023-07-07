import { PrismaClient } from "@prisma/client";


export default function createPrismaClient() {

    const prisma = new PrismaClient({
        log: [
            { level: "query", emit: "event" },
            { level: 'info', emit: 'event' },
            { level: 'warn', emit: 'event' },
            { level: 'error', emit: 'event' },
        ]
    });

    // prisma.$on("query", (event: any) => {
    //     logger.debug("Query: " + event.query);
    //     logger.debug("Duracao: " + event.duration + ' ms');
    // });

    // prisma.$on('info', (event: any) => {
    //     logger.info(event.message);
    // });

    // prisma.$on('warn', (event: any) => {
    //     logger.warning(event.message);
    // });

    // prisma.$on('error', (event: any) => {
    //     logger.error(event.message);
    // });

    return prisma;
}