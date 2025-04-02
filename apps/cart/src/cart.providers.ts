import { Provider } from '@nestjs/common';
import { CART_MODEL, CART_REPOSITORY, DATABASE_CONNECTION } from './di-token';
import { Connection } from 'mongoose';
import { CartSchema } from './cart.schema';
import { CartRepository } from './cart.repository';

export const cartProviders: Provider[] = [
  {
    provide: CART_MODEL,
    useFactory: (connection: Connection) =>
      connection.model('Cart', CartSchema),
    inject: [DATABASE_CONNECTION]
  },
  {
    provide: CART_REPOSITORY,
    useClass: CartRepository
  }
];
