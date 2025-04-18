// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.3.0
//   protoc               v5.28.3
// source: libs/shared/src/proto/cart.proto

/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "cart";

export interface AddToCartRequest {
  userId: string;
  itemId: number;
  quantity: number;
}

export interface AddToCartResponse {
  success: boolean;
}

export const CART_PACKAGE_NAME = "cart";

export interface CartServiceClient {
  addToCart(request: AddToCartRequest): Observable<AddToCartResponse>;
}

export interface CartServiceController {
  addToCart(request: AddToCartRequest): Promise<AddToCartResponse> | Observable<AddToCartResponse> | AddToCartResponse;
}

export function CartServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["addToCart"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("CartService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("CartService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const CART_SERVICE_NAME = "CartService";
