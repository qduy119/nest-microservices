import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';

const YAML_CONFIG_DIR = './dist/libs/shared/config/config.yaml';

export type ShareConfig = {
  app: {
    node_env: string;
    log_level: string;
  };
  auth_grpc: {
    host: string;
    port: number;
  };
  user_grpc: {
    host: string;
    port: number;
  };
  cart_grpc: {
    host: string;
    port: number;
  };
  item_grpc: {
    host: string;
    port: number;
  };
  order_grpc: {
    host: string;
    port: number;
  };
  payment_grpc: {
    host: string;
    port: number;
  };
  payment_rabbitmq: {
    host: string;
    port: number;
    username: string;
    password: string;
  };
  notification_kafka: {
    host: string;
    port: number;
  };
  elastic_rabbitmq: {
    host: string;
    port: number;
    username: string;
    password: string;
  };
  item_rabbitmq: {
    host: string;
    port: number;
    username: string;
    password: string;
  };
  order_rabbitmq: {
    host: string;
    port: number;
    username: string;
    password: string;
  };
};

export default () => {
  return yaml.load(
    readFileSync(join(process.cwd(), YAML_CONFIG_DIR), 'utf8')
  ) as ShareConfig;
};
