import fastify from 'fastify';
import cors from 'fastify-cors';
import multipart from 'fastify-multipart';
import { createWriteStream, mkdirSync } from 'fs';
import { join } from 'path';

const PORT = parseInt(process.env.PORT, 10) || 8282;

const app = fastify({log: true});
app.register(cors, {});
app.register(multipart, {
  limits: {
    fields: 2,
    files: 1,
    // 30M
    fileSize: 30 * 1024 * 1024,
  },
});

app.route({
  method: 'POST',
  url: '/upload',
  handler: async(req, reply) => {
    const data = await req.file();
    console.log('upload file ->', data);
    mkdirSync('downloads', { recursive: true });
    data.file.pipe(createWriteStream(join('downloads', `${Date.now()}.zip`)));
    reply.send('ok');
  },
})

app.listen({ port: PORT, host: '0.0.0.0' })
  .then((serverUrl: string) => console.log(`HTTP Server is running ${serverUrl}`));
