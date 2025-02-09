"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_server_1 = require("@hono/node-server");
const hono_1 = require("hono");
const streaming_1 = require("hono/streaming");
const stream_1 = require("./stream");
const app = new hono_1.Hono();
app.get('/streams/:id', async (c) => {
    const { id } = c.req.param();
    c.header('Content-Type', 'audio/aac');
    return (0, streaming_1.stream)(c, async (stream) => {
        await stream.pipe(await (0, stream_1.getRadikoStream)(id));
    });
});
(0, node_server_1.serve)(app, async (info) => {
    console.log(`Listening on http://localhost:${info.port}`);
});
