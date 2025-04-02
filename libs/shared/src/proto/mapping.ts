import { status } from '@grpc/grpc-js';

export const mappingGrpcStatusToHttpStatus = (errorCode: number): number => {
  switch (errorCode) {
    case status.OK:
      return 200;
    case status.CANCELLED:
      return 499;
    case status.INVALID_ARGUMENT:
      return 400;
    case status.DEADLINE_EXCEEDED:
      return 504;
    case status.NOT_FOUND:
      return 404;
    case status.ALREADY_EXISTS:
      return 409;
    case status.PERMISSION_DENIED:
      return 403;
    case status.UNAUTHENTICATED:
      return 401;
    case status.RESOURCE_EXHAUSTED:
      return 429;
    case status.FAILED_PRECONDITION:
      return 400;
    case status.ABORTED:
      return 409;
    case status.OUT_OF_RANGE:
      return 400;
    case status.UNIMPLEMENTED:
      return 501;
    case status.UNAVAILABLE:
      return 503;
    case status.DATA_LOSS:
    case status.UNKNOWN:
    case status.INTERNAL:
      return 500;
    default:
      return 500;
  }
};
