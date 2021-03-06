import EventEmitter from 'events';
import { Request, Response, Router } from 'express';
import { UserRepo } from '../db/types.js';
import { FinverseClient } from '../finverse/finverse.js';
import { JobQueue } from '../jobQueue/basicJobQueue.js';
import { StorageService } from '../storage/index.js';
import { authToken } from './controllers/authToken.js';
import { createLink } from './controllers/createLink.js';
import { downloadZip } from './controllers/download.js';
import { getStatus } from './controllers/status.js';
import { statefulLiat } from './types.js';

export declare interface ApiWrapper {
    on(event: 'newLink', listener: (liat: statefulLiat) => void): this
}

export class ApiWrapper {
    constructor(private client: FinverseClient, private userRepo: UserRepo, private jobQueue: JobQueue, private storageRepo: StorageService){
    }

    link(req: Request, res: Response) {
        return createLink(req, res, this.client, this.userRepo);
    }

    callback(req: Request, res: Response){
        return authToken(req, res, this.client, this.userRepo, this.jobQueue);
    }

    status(req: Request, res: Response){
        return getStatus(req, res, this.userRepo);
    }

    download(req: Request, res: Response){
        return downloadZip(req, res, this.userRepo, this.storageRepo);
    }
}

export const registerRouter = (wrapper: ApiWrapper): Router => {
    const router = Router();

    router.use('/healthz', (req: Request, res: Response) => {
        res.status(200).end();
    })

    router.get('/link', wrapper.link.bind(wrapper));
    router.get('/callback', wrapper.callback.bind(wrapper));
    router.get('/status/:state', wrapper.status.bind(wrapper));
    router.get('/download/:state', wrapper.download.bind(wrapper));

    return router;
}
