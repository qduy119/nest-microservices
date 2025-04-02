import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus
} from '@nestjs/common';
import { Request, Response } from 'express';
import { mappingGrpcStatusToHttpStatus } from '../proto';

interface IRpcException {
  code: number;
  details: string;
  metadata: {
    'content-type': string[];
    date: string[];
  };
}

@Catch()
export class CatchAllExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    let error = 'RpcException',
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR,
      message = 'Internal Server Error',
      timestamp = new Date().toISOString();

    if (exception instanceof HttpException) {
      error = exception.name;
      statusCode = exception.getStatus();
      message = exception.message;
    } else {
      const rpcError = JSON.parse(JSON.stringify(exception)) as IRpcException;
      statusCode = mappingGrpcStatusToHttpStatus(rpcError.code);
      message = rpcError.details;
      timestamp = new Date(rpcError.metadata.date[0]).toISOString();
    }

    return response.status(statusCode).json({
      statusCode,
      message,
      error,
      timestamp,
      path: request.url
    });
  }
}
