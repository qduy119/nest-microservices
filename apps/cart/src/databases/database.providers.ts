import { ConfigService } from '@nestjs/config';
import * as mongoose from 'mongoose';
import { AppConfig } from '../config';
import { DATABASE_CONNECTION } from '../di-token';

export const databaseProviders = [
  {
    provide: DATABASE_CONNECTION,
    useFactory: async (
      configService: ConfigService
    ): Promise<typeof mongoose> => {
      const { username, password, host, port, dbName } =
        configService.get<AppConfig['db']>('db');
      const url = `mongodb://${username}:${password}@${host}:${port}/${dbName}?authSource=admin`;
      return mongoose.connect(url, {
        sanitizeFilter: true,
        autoCreate: false
      });
    },
    inject: [ConfigService]
  }
];
