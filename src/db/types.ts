export enum UserStatus {
    POLLING = 'POLLING',
    FAILED = 'FAILED',
    SUCCESS = 'SUCCESS',
    WARNING = 'WARNING',
    NOT_FOUND = 'NOT_FOUND', 
    PROCESSING = 'PROCESSING', // Downloading / zipping statements
    READY = 'READY', // Now hit another endpoint to get the zip? TBD
}

export interface UserRepo {
    getStatus(state: string): UserStatus;
    setStatus(state: string, status: UserStatus): void;
}