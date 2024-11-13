import winston, { transports, format } from 'winston';
import {
  WinstonModule,
  utilities as nestWinstonModuleUtilities
} from 'nest-winston';

export const LoggerFactory = (appName: string, logLevel: string) => {
  const consoleFormat = format.combine(
    format.timestamp(),
    format.ms(),
    nestWinstonModuleUtilities.format.nestLike(appName, {
      colors: true,
      prettyPrint: true
    })
  );
  return WinstonModule.createLogger({
    level: logLevel,
    transports: [
      new transports.Console({ format: consoleFormat }),
      new winston.transports.File({
        filename: 'logs/error.log',
        level: 'error'
      }),
      new winston.transports.File({ filename: 'logs/warn.log', level: 'warn' }),
      new winston.transports.File({ filename: 'logs/info.log', level: 'info' }),
      new winston.transports.File({ filename: 'logs/http.log', level: 'http' }),
      new winston.transports.File({
        filename: 'logs/debug.log',
        level: 'debug'
      })
    ],
    exceptionHandlers: [
      new winston.transports.File({ filename: 'logs/exception.log' })
    ],
    rejectionHandlers: [
      new winston.transports.File({ filename: 'logs/rejections.log' })
    ]
  });
};
