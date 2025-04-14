import { resolve } from 'path';
import { USER_PACKAGE_NAME } from './user';
import { AUTH_PACKAGE_NAME } from './auth';
import { CART_PACKAGE_NAME } from './cart';
import { ITEM_PACKAGE_NAME } from './item';
import { ORDER_PACKAGE_NAME } from './order';
import { UPLOAD_PACKAGE_NAME } from './upload';

export const userGrpcOption = {
  package: USER_PACKAGE_NAME,
  protoPath: resolve(__dirname, '../../libs/shared/proto/user.proto')
};

export const authGrpcOption = {
  package: AUTH_PACKAGE_NAME,
  protoPath: resolve(__dirname, '../../libs/shared/proto/auth.proto')
};

export const cartGrpcOption = {
  package: CART_PACKAGE_NAME,
  protoPath: resolve(__dirname, '../../libs/shared/proto/cart.proto')
};

export const itemGrpcOption = {
  package: ITEM_PACKAGE_NAME,
  protoPath: resolve(__dirname, '../../libs/shared/proto/item.proto')
};

export const orderGrpcOption = {
  package: ORDER_PACKAGE_NAME,
  protoPath: resolve(__dirname, '../../libs/shared/proto/order.proto')
};

export const fileGrpcOption = {
  package: UPLOAD_PACKAGE_NAME,
  protoPath: resolve(__dirname, '../../libs/shared/proto/upload.proto')
};

export * from './mapping';
