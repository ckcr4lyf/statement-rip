import { StatementInfo } from "../finverse/types.js";

export interface StorageService {
    savePdf(state: string, data: Buffer, statementInfo: StatementInfo): Promise<void>;
}