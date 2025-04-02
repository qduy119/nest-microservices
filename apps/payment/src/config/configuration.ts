import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';

const YAML_CONFIG_FILENAME = './config/config.yaml';

export type AppConfig = {
  db: {
    username: string;
    password: string;
    host: string;
    port: number;
    dbName: string;
  };
};

export default () => {
  return yaml.load(
    readFileSync(join(__dirname, YAML_CONFIG_FILENAME), 'utf8')
  ) as AppConfig;
};
