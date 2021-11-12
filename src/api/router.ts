import express, { Request, RequestHandler, Response, Router } from 'express';
import { FinverseClient } from '../finverse/index.js';
import { createLink } from './controllers/createLink.js';

export class ApiWrapper {
    constructor(private client: FinverseClient){
        //no-op
    }

    link(req: Request, res: Response) {
        return createLink(req, res, this.client);
    }
}

export const registerRouter = (wrapper: ApiWrapper): Router => {
    const router = Router();

    router.use('/healthz', (req: Request, res: Response) => {
        res.status(200).end();
    })

    router.use('/link', wrapper.link.bind(wrapper));
    return router;
}
