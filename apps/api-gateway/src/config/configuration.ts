import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';

const YAML_CONFIG_FILENAME = 'config.yaml';

export type AppConfig = {
  app: {
    node_env: string;
    log_level: string;
  };
  http: {
    host: string;
    port: number;
  };
};

export default () => {
  return yaml.load(
    readFileSync(join(__dirname, YAML_CONFIG_FILENAME), 'utf8')
  ) as AppConfig;
};
