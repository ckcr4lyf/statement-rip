import { Request, RequestHandler, Response, Send } from "express";
import { ulid } from "ulid";
import { UserRepo, UserStatus } from "../../db/types.js";
import { FinverseClient } from "../../finverse/finverse.js";

export const createLink = async (req: Request, res: Response, client: FinverseClient, userRepo: UserRepo) => {    
    const state = ulid();
    const linkRes = await client.createLinkToken('brover', state);

    res.status(200).json({
        ...linkRes,
        state
    });

    userRepo.setStatus(state, UserStatus.PRE_LINK);

    return;
}