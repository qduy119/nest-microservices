// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.3.0
//   protoc               v5.28.3
// source: libs/shared/src/proto/upload.proto

/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "upload";

export interface File {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Uint8Array;
  destination: string;
  filename: string;
  path: string;
}

export interface UploadFileRequest {
  file: File | undefined;
  folder: string;
}

export interface UploadFileResponse {
  url: string;
  secureUrl: string;
}

export const UPLOAD_PACKAGE_NAME = "upload";

export interface UploadServiceClient {
  uploadFile(request: UploadFileRequest): Observable<UploadFileResponse>;
}

export interface UploadServiceController {
  uploadFile(
    request: UploadFileRequest,
  ): Promise<UploadFileResponse> | Observable<UploadFileResponse> | UploadFileResponse;
}

export function UploadServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["uploadFile"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("UploadService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("UploadService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const UPLOAD_SERVICE_NAME = "UploadService";
