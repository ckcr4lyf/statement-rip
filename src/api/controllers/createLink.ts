import { Request, RequestHandler, Response, Send } from "express";
import { ulid } from "ulid";
import { FinverseClient } from "../../finverse/index.js";

export const createLink = async (req: Request, res: Response, client: FinverseClient) => {
    const state = ulid();
    const linkRes = await client.createLinkToken('brover', state);
    return res.status(200).json(linkRes);
}