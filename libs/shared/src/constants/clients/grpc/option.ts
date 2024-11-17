import { authProtoPath, userProtoPath } from '@app/shared/proto';
import { AUTH_PACKAGE_NAME } from '@app/shared/proto/auth';
import { USER_PACKAGE_NAME } from '@app/shared/proto/user';

export const userGrpcClientOption = {
  package: USER_PACKAGE_NAME,
  protoPath: userProtoPath
};

export const authGrpcClientOption = {
  package: AUTH_PACKAGE_NAME,
  protoPath: authProtoPath
};
