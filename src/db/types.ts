export enum UserStatus {
    POLLING = 'POLLING',
    FAILED = 'FAILED',
    SUCCESS = 'SUCCESS',
    NOT_FOUND = 'NOT_FOUND',
}

export interface UserRepo {
    getStatus(state: string): UserStatus;
    setStatus(state: string, status: UserStatus): void;
}