/**
 * Get the status of statement retrieval for a state
 */

import { Request, Response } from "express";
import { UserRepo } from "../../db/types.js";

export const getStatus = async (req: Request, res: Response, userRepo: UserRepo) => {
    const state = req.params.state;
    const status = userRepo.getStatus(state);

    res.status(200).json({
        status: status
    });
}