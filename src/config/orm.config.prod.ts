import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as path from 'node:path';

export default registerAs(
  'orm.config',
  (): TypeOrmModuleOptions => ({
    type: 'postgres',
    host: 'localhost', // TODO: replace with production host
    port: 5432,
    username: 'postgres', // TODO: replace with production credential
    password: '3l3tr0n1k4', // TODO: replace with production credential
    database: 'lovememo-db',
    entities: [path.join(__dirname, '/**/*.entity{.ts,.js}')],
    synchronize: false,
  }),
);
