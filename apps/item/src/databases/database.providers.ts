import { ConfigService } from '@nestjs/config';
import { Sequelize } from 'sequelize-typescript';
import { AppConfig } from '../config';
import { ITEM_SEQUELIZE } from '../di-token';
import { ItemModel } from '../item.model';
import { seeder } from './seeder';

export const databaseProviders = [
  {
    provide: ITEM_SEQUELIZE,
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
      sequelize.addModels([ItemModel]);
      const isTableExisted = await sequelize
        .getQueryInterface()
        .tableExists('Items');
      if (!isTableExisted) {
        await sequelize.sync();
        await ItemModel.bulkCreate(seeder);
      } else {
        await sequelize.sync();
      }
      return sequelize;
    },
    inject: [ConfigService]
  }
];
