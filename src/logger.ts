import { createLogger, format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import fs from 'fs';
import path from 'path';

const env = process.env.NODE_ENV || 'development';
const logDir = 'log';
const datePatternConfiguration = {
    default: 'YYYY-MM-DD',
    everHour: 'YYYY-MM-DD-HH',
    everMinute: 'YYYY-MM-DD-THH-mm',
};
const numberOfDaysToKeepLog = 30;
const fileSizeToRotate = 1; // in megabyte

// Create the logs directory if it doesn't exist
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

const filename = process.mainModule?.filename ?? '';
const label = path.basename(filename);

const dailyRotateFileTransport = new DailyRotateFile({
    filename: `${logDir}/%DATE%-results.log`,
    datePattern: datePatternConfiguration.default,
    zippedArchive: true,
    maxSize: `${fileSizeToRotate}m`,
    maxFiles: `${numberOfDaysToKeepLog}d`
});

// Create a Winston logger instance
const logger = createLogger({
    level: env === 'development' ? 'verbose' : 'info',
    handleExceptions: true,
    format: format.combine(
        format.label({ label }),
        format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
        }),
        format.printf(info => `${info.timestamp}[${info.label}] ${info.level}: ${JSON.stringify(info.message)}`),
    ),
    transports: [
        new transports.Console({
            level: 'info',
            handleExceptions: true,
            format: format.combine(
                format.label({ label }),
                format.colorize(),
                format.printf(
                    info => `${info.timestamp}[${info.label}] ${info.level}: ${info.message}`,
                ),
            ),
        }),
        dailyRotateFileTransport,
    ],
});

// Create a Morgan stream to capture Morgan logs
export const morganStream = {
    write: (message: string) => {
        logger.info(message);
    },
};
