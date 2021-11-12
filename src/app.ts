import express from 'express';
import { createServer } from 'http';
import { ApiWrapper, registerRouter } from './api/router.js';
import { getConfig } from './config.js';
import { FinverseClient } from './finverse/index.js';

const config = getConfig();

const app = express();
const client = new FinverseClient(config.FV_CLIENT_ID, config.FV_CLIENT_SECRET, config.FV_REDIRECT_URI);
await client.getCustomerToken();

const wrapper = new ApiWrapper(client);
const router = registerRouter(wrapper);

app.use(router);

createServer(app).listen(config.SERVER_IP, config.SERVER_PORT, () => {
    console.log('Started');
});
