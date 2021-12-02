import fs from 'fs';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import { config } from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config({ path: path.resolve(__dirname, '../.env') });

const webTemplatePath = path.join(__dirname, 'web_main.js');
const finalBuildPath = path.join(__dirname, '../public/main.js');
const webMain = (await fs.promises.readFile(webTemplatePath)).toString();


const replaced = webMain.replace('<<REPLACE_API_HOST>>', process.env.WEB_API_HOST);

await fs.promises.writeFile(finalBuildPath, replaced);