import { Request, Response } from "express";
import { UserRepo, UserStatus } from "../../db/types.js";
import { FinverseClient } from "../../finverse/finverse.js";
import { JobQueue } from "../../jobQueue/basicJobQueue.js";

export const authToken = async (req: Request, res: Response, client: FinverseClient, userRepo: UserRepo, jobQueue: JobQueue) => {
    const code = <string> req.query.code;
    const state = <string> req.query.state;
    const error = <string> req.query.error;

    if (error !== undefined){
        console.log('GG WE FUCKED UP');
        return res.status(200).end();
    }

    // console.log(code);
    const liat = await client.exchangeCode(code);
    // console.log(liat);
    res.status(200).json(liat);
    userRepo.setStatus(state, UserStatus.POLLING);

    // Propagate to job queue that there is a new job to poll
    void jobQueue.poll(state, liat.access_token);
}