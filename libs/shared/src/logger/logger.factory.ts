import * as winston from 'winston';
import {
  WinstonModule,
  utilities as nestWinstonModuleUtilities
} from 'nest-winston';
import 'winston-daily-rotate-file';

export const LoggerFactory = (appName: string, logLevel: string) => {
  const { combine, timestamp, json } = winston.format;

  return WinstonModule.createLogger({
    level: logLevel,
    format: combine(
      timestamp({
        format: 'YYYY-MM-DD hh:mm:ss.SSS A'
      }),
      nestWinstonModuleUtilities.format.nestLike(appName, {
        colors: true,
        prettyPrint: true
      })
    ),
    transports: [
      new winston.transports.Console(),
      ...['debug', 'error'].map((level) => {
        return new winston.transports.DailyRotateFile({
          dirname: 'logs',
          filename: `%DATE%-${level}.log`,
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '1m',
          maxFiles: '7d',
          format: combine(
            timestamp({
              format: 'YYYY-MM-DD hh:mm:ss.SSS A'
            }),
            json()
          ),
          level
        });
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
