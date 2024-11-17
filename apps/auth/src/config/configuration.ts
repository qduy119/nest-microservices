import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';

const YAML_CONFIG_FILENAME = 'config.yaml';

export type AppConfig = {
  app: {
    node_env: string;
    log_level: string;
  };
  jwt: {
    access_token: {
      secret_key: string;
      expires_in: string;
    };
    refresh_token: {
      secret_key: string;
      expires_in: string;
    };
  };
  oauth2: {
    google: {
      client_id: string;
      client_secret: string;
      client_callback: string;
    };
    github: {
      client_id: string;
      client_secret: string;
      client_callback: string;
    };
  };
};

export default () => {
  return yaml.load(
    readFileSync(join(__dirname, YAML_CONFIG_FILENAME), 'utf8')
  ) as AppConfig;
};
