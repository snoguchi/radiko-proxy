import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { stream } from 'hono/streaming';
import { getRadikoStream } from './stream';

const app = new Hono();

app.get('/streams/:id', async (c) => {
  const { id } = c.req.param();
  c.header('Content-Type', 'audio/aac');
  return stream(c, async (stream) => {
    await stream.pipe(await getRadikoStream(id));
  });
});

serve(app, async (info) => {
  console.log(`Listening on http://localhost:${info.port}`);
});
