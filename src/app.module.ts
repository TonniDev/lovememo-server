import { Module } from '@nestjs/common';
import {ConfigModule, ConfigService} from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {Goal} from "./goals/entities/goal.entity";
import { User } from './users/entities/user.entity';
import { GoalsController } from './goals/goals.controller';
import {UsersController} from "./users/users.controller";
import {UsersService} from "./users/users.service";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      // @ts-expect-error Not typings for .env variables
      useFactory: (configService: ConfigService) => ({
        type: configService.get('DB_DIALECT'),
        host: configService.get('DB_HOST_DEV'),
        port: configService.get('DB_PORT_DEV'),
        username: configService.get('DB_USER_DEV'),
        password: configService.get('DB_PASS_DEV'),
        database: configService.get('DB_NAME_DEV'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: false,
        autoLoadEntities: true,
        migrations: [__dirname + '/db/migrations/**/*{.ts,.js}'],
        seeds: [__dirname + '/db/seeds/**/*{.ts,.js}'],
        factories: [__dirname + '/db/factories/**/*{.ts,.js}'],
        cli: {
          migrationsDir: __dirname + '/db/migrations/',
        },
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([User, Goal]),
  ],
  controllers: [AppController, GoalsController, UsersController],
  providers: [AppService, UsersService],
})
export class AppModule {}
