/**
 * A basic Event Based job queue
 */

import { UserRepo, UserStatus } from "../db/types.js";
import { FinverseClient } from "../finverse/finverse.js";
import { StorageService } from "../storage/index.js";
import { getLogger } from "../utils/logger.js";

export class JobQueue {

    constructor(private client: FinverseClient, private userRepo: UserRepo, private storageService: StorageService){
    }

    async getStatements(state: string, liat: string){
        const logger = getLogger('getStatements');

        logger.info('Starting');
        const statementsOverview = await this.client.getStatementsOverview(liat);

        if (statementsOverview.statements === null){
            logger.warn(`No statements sadge`);
            // Set status to not found?
            this.userRepo.setStatus(state, UserStatus.NOT_FOUND);
            return;
        }
        
        logger.info(`Got ${statementsOverview.statements.length} statements.`);

        // Now need to download all of them, and zip em up
        for (let i = 0; i < statementsOverview.statements.length; i++){
            const statementInfo = statementsOverview.statements[i];
            logger.info(`Going to download statement: ${statementInfo.name} for ${statementInfo.date}`);
            const statementData = await this.client.downloadStatement(statementInfo.id, liat);
            await this.storageService.savePdf(state, statementData, statementInfo);
        }

        // Time to zip
        logger.info('Going to zip all statements');
        await this.storageService.prepareZip(state);
        this.userRepo.setStatus(state, UserStatus.SUCCESS);
    }

    async poll(state: string, liat: string){

        const logger = getLogger('poll');

        // We keep polling every 10 sec till legit
        // Upto 3 mins (18 times)
        logger.info(`Will start polling`, liat);

        for (let i = 0; i < 18; i++){
            logger.info(`Poll ${i+1}`);
            const loginIdentity = await this.client.getLoginIdentity(liat);

            const statementsStatus = loginIdentity.login_identity.product_status.statements?.status;

            if (statementsStatus === undefined){
                logger.info(`Statements status undefined, will keep polling`);
            } if (statementsStatus === 'SUCCESS'){
                logger.info('We gucci');
                // this.userRepo.setStatus(state, UserStatus.SUCCESS);
                this.userRepo.setStatus(state, UserStatus.PROCESSING);
                // If the frontend had an open WS to us, here is where we'd
                // Fire an event, which would tell the WS handler to reply 
                // to the frontend with details or shit

                // Actually, probably here we want to trigger statement retrieval job
                void this.getStatements(state, liat);
                return;
            } else if (statementsStatus === 'WARNING'){
                logger.info('WARNING');
                // this.userRepo.setStatus(state, UserStatus.WARNING);
                this.userRepo.setStatus(state, UserStatus.PROCESSING);
                void this.getStatements(state, liat);
                return;
            } else {
                logger.info(statementsStatus);
            }

            await new Promise(r => setTimeout(r, 10 * 1000));
        }

        // Still not? FAILED
        logger.info('Will mark as failed');
        this.userRepo.setStatus(state, UserStatus.FAILED);
    }
}