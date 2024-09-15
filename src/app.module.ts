import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import ormConfig from "./config/orm.config";
import ormConfigProd from "./config/orm.config.prod";
import {Goal} from "./goals/entities/goal.entity";
import { User } from './users/entities/user.entity';
import { GoalsController } from './goals/goals.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [ormConfig],
      expandVariables: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory:
        process.env.NODE_ENV !== 'production' ? ormConfig : ormConfigProd,
    }),
    TypeOrmModule.forFeature([User, Goal]),
  ],
  controllers: [AppController, GoalsController],
  providers: [AppService],
})
export class AppModule {}
