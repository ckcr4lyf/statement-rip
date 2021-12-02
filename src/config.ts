import path from 'path';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config({ path: path.resolve(__dirname, '../.env')});

export const getConfig = () => {
    return {
        FV_CLIENT_ID: process.env.FV_CLIENT_ID || '',
        FV_CLIENT_SECRET: process.env.FV_CLIENT_SECRET || '',
        FV_REDIRECT_URI: process.env.FV_REDIRECT_URI || '',
        SERVER_IP: process.env.SERVER_IP || '127.0.0.1',
        SERVER_PORT: parseInt(process.env.SERVER_PORT || '3000'),
        WEB_API_HOST: process.env.WEB_API_HOST || 'localhost',
    }
}
