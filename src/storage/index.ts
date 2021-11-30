import { StatementInfo } from "../finverse/types.js";

export interface StorageService {
    savePdf(state: string, data: Buffer, statementInfo: StatementInfo): Promise<void>;
    prepareZip(state: string): Promise<void>;
    getZip(state: string): Promise<Buffer>;
}