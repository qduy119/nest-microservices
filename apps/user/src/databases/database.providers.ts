import { ConfigService } from '@nestjs/config';
import { Sequelize } from 'sequelize-typescript';
import { AppConfig } from '../config';
import { UserModel } from '../user.model';
import { USER_SEQUELIZE } from '../di-token';

export const databaseProviders = [
  {
    provide: USER_SEQUELIZE,
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
      sequelize.addModels([UserModel]);
      await sequelize.sync();
      return sequelize;
    },
    inject: [ConfigService]
  }
];
