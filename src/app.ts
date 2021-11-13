import express from 'express';
import { createServer } from 'http';
import { ApiWrapper, registerRouter } from './api/router.js';
import { getConfig } from './config.js';
import { LocalUserRepo } from './db/local.js';
import { UserStatus } from './db/types.js';
import { FinverseClient } from './finverse/index.js';
import { JobQueue } from './jobQueue/index.js';

const config = getConfig();

const app = express();
const localUserRepo = new LocalUserRepo();
const client = new FinverseClient(config.FV_CLIENT_ID, config.FV_CLIENT_SECRET, config.FV_REDIRECT_URI);
await client.getCustomerToken();

// Maybe instead of wrapper being an EventEmitter
// We have a "JobManager" which is an EventEmitter
// which we can pass in to the ApiWrapper to pass jobs
// and whatnot
const jobQueue = new JobQueue(client, localUserRepo);
const wrapper = new ApiWrapper(client, localUserRepo, jobQueue);

wrapper.on('newLink', (liat) => {
    console.log('new link', liat);
    localUserRepo.setStatus(liat.state, UserStatus.POLLING);
});

const router = registerRouter(wrapper);

app.use(router);

createServer(app).listen(config.SERVER_PORT, config.SERVER_IP, () => {
    console.log('Started');
});

process.on('uncaughtException', (err) => {
    console.error(err);
});

process.on('unhandledRejection', (err) => {
    console.error(err);
})