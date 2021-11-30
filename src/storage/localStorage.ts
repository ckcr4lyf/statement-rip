/**
 * Will allow saving PDFs to local disk
 * 
 */

import os from 'os';
import path from 'path';
import fs from 'fs';
import AdmZip from 'adm-zip';

import { StorageService } from './index.js';
import { StatementInfo } from '../finverse/types.js';
import { getLogger } from '../utils/logger.js';

function isFsError(e: any): e is NodeJS.ErrnoException {
    if (typeof e.code === 'string'){
        return true;
    }

    return false;
}

export class LocalStorage implements StorageService {

    private tempDirPath: string;

    constructor(){
        this.tempDirPath = os.tmpdir();
    }

    async savePdf(state: string, data: Buffer, statementInfo: StatementInfo){
        const logger = getLogger('savePdf');
        const stateDirPath = path.join(this.tempDirPath, state);
        let pathInfo: fs.Stats;

        // Kinda need to wrap this to make sire the path exist, is a dir, else make it etc.
        try {
            pathInfo = await fs.promises.stat(stateDirPath);
        } catch (e){
            if (isFsError(e)){
                if (e.code === 'ENOENT'){
                    // Does not exist, make it
                    await fs.promises.mkdir(stateDirPath);
                    pathInfo = await fs.promises.stat(stateDirPath);
                } else {
                    throw e;
                }
            } else {
                throw e;
            }
        }

        if (pathInfo.isDirectory() === false){
            throw new Error("Not a directory");
        }

        // Now write the buffer to a new file in there
        const filename = `${statementInfo.name} - ${statementInfo.date}.pdf`;
        const statementPath = path.join(stateDirPath, filename);
        await fs.promises.writeFile(statementPath, data);
        logger.info(`Saved PDF to ${statementPath}`);
    }

    async prepareZip(state: string){
        const logger = getLogger('prepareZip');
        
        // Get list of files
        const stateDirPath = path.join(this.tempDirPath, state);
        const files = await fs.promises.readdir(stateDirPath);

        // Make the new zip thingy
        const zip = new AdmZip();

        for (let file of files){
            const fileData = await fs.promises.readFile(path.join(stateDirPath, file));
            zip.addFile(file, fileData);
            logger.info(`Added ${file} to zip`);
        }

        const finalFile = path.join(stateDirPath, 'download.zip');
        zip.writeZip(finalFile);
    }
}