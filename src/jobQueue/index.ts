/**
 * A basic Event Based job queue
 */

import EventEmitter from "events";
import { UserRepo, UserStatus } from "../db/types.js";
import { FinverseClient } from "../finverse/index.js";

export class JobQueue extends EventEmitter {

    constructor(private client: FinverseClient, private userRepo: UserRepo){
        super();
    }

    async getStatements(liat: string){
        const statementsOverview = await this.client.getStatementsOverview(liat);

        if (statementsOverview.statements === null){
            console.log(`No statements sagde`);
            return;
        }
        
        console.log(`Got ${statementsOverview.statements.length} statements.`);
    }

    async poll(state: string, liat: string){

        // We keep polling every 10 sec till legit
        // Upto 3 mins (18 times)
        console.log(`Will start polling`, liat);

        for (let i = 0; i < 18; i++){
            console.log(`Poll ${i+1}`);
            const loginIdentity = await this.client.getLoginIdentity(liat);

            const statementsStatus = loginIdentity.login_identity.product_status.statements?.status;

            if (statementsStatus === undefined){
                console.log(`Statements status undefined, will keep polling`);
            } if (statementsStatus === 'SUCCESS'){
                console.log('We gucci');
                this.userRepo.setStatus(state, UserStatus.SUCCESS);
                // If the frontend had an open WS to us, here is where we'd
                // Fire an event, which would tell the WS handler to reply 
                // to the frontend with details or shit

                // Actually, probably here we want to trigger statement retrieval job
                void this.getStatements(liat);
                return;
            } else if (statementsStatus === 'WARNING'){
                console.log('WARNING');
                this.userRepo.setStatus(state, UserStatus.WARNING);
                void this.getStatements(liat);
                return;
            } else {
                console.log(statementsStatus);
            }

            await new Promise(r => setTimeout(r, 10 * 1000));
        }

        // Still not? FAILED
        console.log('Will mark as failed');
        this.userRepo.setStatus(state, UserStatus.FAILED);
    }
}