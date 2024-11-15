import { authProtoPath, userProtoPath } from '@app/shared/proto';

export const userGrpcClientOption = {
  package: 'user',
  protoPath: userProtoPath
};

export const authGrpcClientOption = {
  package: 'auth',
  protoPath: authProtoPath
};
