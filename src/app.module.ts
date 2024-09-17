import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { baseDataSource } from './db/data-source';
import { Goal } from './goals/entities/goal.entity';
import { GoalsController } from './goals/goals.controller';
import { User } from './users/entities/user.entity';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (_configService: ConfigService) => baseDataSource(),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([User, Goal]),
  ],
  controllers: [AppController, GoalsController, UsersController],
  providers: [AppService, UsersService],
})
export class AppModule {}
