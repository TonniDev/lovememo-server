import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as path from 'node:path';

export default registerAs(
  'orm.config',
  (): TypeOrmModuleOptions => ({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: '3l3tr0n1k4',
    database: 'lovememo-db',
    entities: [path.join(__dirname, '/**/*.entity{.ts,.js}')],
    synchronize: true,
  }),
);
