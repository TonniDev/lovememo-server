import * as dotenv from 'dotenv';
import * as process from 'node:process';
import * as path from 'node:path';
dotenv.config();
import { DataSource } from 'typeorm';

export default new DataSource({
  // @ts-expect-error No typing for .env
  type: process.env.DB_DIALECT,
  host: process.env.DB_HOST_DEV,
  // @ts-expect-error No typing for .env
  port: process.env.DB_PORT_DEV,
  username: process.env.DB_USER_DEV,
  password: process.env.DB_PASS_DEV,
  database: process.env.DB_NAME_DEV,
  synchronize: false,
  dropSchema: false,
  logging: false,
  logger: 'file',
  entities: [path.join(__dirname, '../**/*.entity{.ts,.js}')],
  migrations: [__dirname + '/migrations/**/*.ts'],
  subscribers: [__dirname + '/subscriber/**/*.ts'],
  migrationsTableName: 'migration_table',
});
