/**
 * Download a states zip file
 */

 import { Request, Response } from "express";
 import { UserRepo, UserStatus } from "../../db/types.js";
import { StorageService } from "../../storage/index.js";
 
 export const downloadZip = async (req: Request, res: Response, userRepo: UserRepo, storageRepo: StorageService) => {
     const state = req.params.state;
     const status = userRepo.getStatus(state);

     if (status === UserStatus.SUCCESS){

        // Get zip from storage repo
        const data = await storageRepo.getZip(state);

        res.set('Content-disposition', 'attachment; filename=download.zip');
        res.set('Content-Type', 'application/octet-stream');
        res.status(200).send(data).end();
     } else {
         res.status(500).end();
     }
 }