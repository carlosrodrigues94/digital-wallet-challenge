import { Knex } from 'knex';
import { resolve } from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

const config: Knex.Config = {
  client: 'pg',
  migrations: {
    extension: 'ts',
    directory: resolve(__dirname, './migrations'),
  },
  connection: {
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
  },
};

export default config;
