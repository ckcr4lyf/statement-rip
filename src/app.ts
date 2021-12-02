import express from 'express';
import { createServer } from 'http';
import { ApiWrapper, registerRouter } from './api/router.js';
import { getConfig } from './config.js';
import { LocalUserRepo } from './db/localDb.js';
import { FinverseClient } from './finverse/finverse.js';
import { JobQueue } from './jobQueue/basicJobQueue.js';
import { LocalStorage } from './storage/localStorage.js';
import { getLogger } from './utils/logger.js';
import cors from 'cors';

const config = getConfig();

const app = express();
app.use(cors());

const localUserRepo = new LocalUserRepo();
const client = new FinverseClient(config.FV_CLIENT_ID, config.FV_CLIENT_SECRET, config.FV_REDIRECT_URI);
await client.getCustomerToken();

// Maybe instead of wrapper being an EventEmitter
// We have a "JobManager" which is an EventEmitter
// which we can pass in to the ApiWrapper to pass jobs
// and whatnot
const localStorage = new LocalStorage();
const jobQueue = new JobQueue(client, localUserRepo, localStorage);
const wrapper = new ApiWrapper(client, localUserRepo, jobQueue, localStorage);
const logger = getLogger('app')

const router = registerRouter(wrapper);

app.use(router);

createServer(app).listen(config.SERVER_PORT, config.SERVER_IP, () => {
    logger.info('Started');
});

process.on('uncaughtException', (err) => {
    console.error(err);
});

process.on('unhandledRejection', (err) => {
    console.error(err);
})