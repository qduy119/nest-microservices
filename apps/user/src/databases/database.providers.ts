import { ConfigService } from '@nestjs/config';
import { Sequelize } from 'sequelize-typescript';
import { AppConfig } from '../config';
import { User } from '../user.entity';

export const databaseProviders = [
  {
    provide: 'USER_SEQUELIZE',
    useFactory: async (configService: ConfigService) => {
      const { host, port, username, password, database } =
        configService.get<AppConfig['db']>('db');
      const sequelize = new Sequelize({
        dialect: 'postgres',
        host,
        port,
        username,
        password,
        database
      });
      sequelize.addModels([User]);
      await sequelize.sync();
      return sequelize;
    },
    inject: [ConfigService]
  }
];
