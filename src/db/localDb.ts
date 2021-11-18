import { UserRepo, UserStatus } from "./types.js";

export class LocalUserRepo implements UserRepo {

    private statusStorage: Record<string, UserStatus>

    constructor(){
        this.statusStorage = {};
    }

    getStatus(state: string): UserStatus {
        if ((state in this.statusStorage) === false){
            return UserStatus.UNKNOWN;
        }

        return this.statusStorage[state];
    }

    setStatus(state: string, status: UserStatus){
        this.statusStorage[state] = status;
    }
}