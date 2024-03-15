import { FastifyInstance } from "fastify";
import { FileMeta, FileMetaView1 } from "./entities/file-meta";
import { FileMapper } from "./queries/file-mapper";

export default function (fastify: FastifyInstance) {

    fastify.post('/files', { onRequest: [ fastify.authenticate ] }, async (request, reply) => {

        const { saveFile } = request.diScope.cradle;

        const files = request.files({
            limits: {
                fileSize: 1024 * 1024 * 20
            }
        });

        const result: FileMetaView1[] = [];

        for await (const file of files)
        {
            const data = await file.toBuffer();

            const fileResult = await saveFile.execute({
                fileMeta: {
                    name: file.filename,
                    mimeType: file.mimetype,
                    size: data.byteLength,
                    data: data
                }
            });

            result.push(fileResult);
        }

        return result;
    });

    fastify.get<{ Params: { fileId: string } }>('/files/:fileId/meta', { onRequest: [ fastify.authenticate ] }, async (request, reply) => {

        const { getFileById } = request.diScope.cradle;

        let fileId = parseInt(request.params.fileId);
        fileId = isFinite(fileId) ? fileId : 0;

        const result = await getFileById.execute({ fileId: fileId });
        return result ? FileMapper.mapView1FromFileMeta(result) : null;
    });

    fastify.get<{ Params: { fileId: string } }>('/files/:fileId', { onRequest: [ fastify.authenticate ] }, async (request, reply) => {

        const { getFileById } = request.diScope.cradle;

        let fileId = parseInt(request.params.fileId);
        fileId = isFinite(fileId) ? fileId : 0;

        const result = await getFileById.execute({ fileId: fileId });
        if (!result)
            return null;

        reply.header('Content-Disposition', 'attachment; filename=' + result.name);
        reply.type(result.mimeType);
        reply.send(result.data);
    });
}