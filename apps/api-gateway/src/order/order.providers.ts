import { Provider } from '@nestjs/common';
import { ORDER_SERVICE_CLIENT } from './di-token';
import { OrderService } from './order.service';

export const cartProviders: Provider[] = [
  {
    provide: ORDER_SERVICE_CLIENT,
    useClass: OrderService
  }
];
