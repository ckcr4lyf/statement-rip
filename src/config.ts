import path from 'path';
import { config } from 'dotenv';

config({ path: path.resolve(__dirname, '../.env')});

export const getConfig = () => {
    return {
        FV_CLIENT_ID: process.env.FV_CLIENT_ID || '',
        FV_CLIENT_SECRET: process.env.FV_CLIENT_SECRET || '',
    }
}
