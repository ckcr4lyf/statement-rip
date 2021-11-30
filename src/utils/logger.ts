enum LOGLEVEL {
    DEBUG = 'DEBUG',
    INFO = 'INFO',
    WARN = 'WARN',
    ERROR = 'ERROR',
}

class Logger {
    constructor(){

    }

    log(level: LOGLEVEL, message: string, ...args: any[]){
        const timestamp = new Date().toISOString();

        if (args.length !== 0){
            console.log(`[${timestamp}] ${level}: ${message}\n${JSON.stringify(args, null, 2)}`);
        } else {
            console.log(`[${timestamp}] ${level}: ${message}`);
        }
    }

    debug(msg: string, ...args: any[]){
        this.log(LOGLEVEL.DEBUG, msg, ...args);
    }

    info(msg: string, ...args: any[]){
        this.log(LOGLEVEL.INFO, msg, ...args);
    }
    
    warn(msg: string, ...args: any[]){
        this.log(LOGLEVEL.WARN, msg, ...args);
    }
}

export const getLogger = (loggerName: string) => {
    return new Logger();
}