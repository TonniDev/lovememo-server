import * as path from 'node:path';
import * as process from 'node:process';
import * as dotenv from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

dotenv.config();

export const baseDataSource = (config?: Partial<DataSourceOptions>): DataSourceOptions => {
  return {
    // @ts-expect-error No typing for .env
    type: process.env.DB_DIALECT,
    host: process.env.DB_HOST,
    // @ts-expect-error No typing for .env
    port: process.env.DB_PORT,
    username: process.env.DB_USER,
    // @ts-expect-error No typing for .env
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    synchronize: true,
    autoLoadEntities: true,
    dropSchema: false,
    logging: true,
    logger: 'file',
    entities: [path.join(__dirname, '../**/*.entity{.ts,.js}')],
    migrations: [__dirname + '/migrations/**/*.ts'],
    seeds: [__dirname + '/db/seeds/**/*{.ts,.js}'],
    factories: [__dirname + '/db/factories/**/*{.ts,.js}'],
    subscribers: [__dirname + '/subscriber/**/*.ts'],
    migrationsTableName: 'migration_table',
    ...config,
  };
};

export default new DataSource(baseDataSource());
