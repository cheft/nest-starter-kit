import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Category } from './entity/category';
import { CategoryService } from './service/category';
import { CategoryController } from './controller/category';

import { Tag } from './entity/tag';
import { TagService } from './service/tag';
import { TagController } from './controller/tag';

import { Topic } from './entity/topic';
import { TopicService } from './service/topic';
import { TopicController } from './controller/topic';

import { User } from './entity/user';
import { UserService } from './service/user';
import { UserController } from './controller/user';

import { Token } from './entity/token';
import { AuthModule } from './auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    TypeOrmModule.forFeature([Category]),
    TypeOrmModule.forFeature([Tag]),
    TypeOrmModule.forFeature([Topic]),
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Token]),

    AuthModule,
  ],
  providers: [
    CategoryService,
    TagService,
    TopicService,
    UserService,
  ],
  controllers: [
    CategoryController,
    TagController,
    TopicController,
    UserController,
  ]
})

export class AppModule {}
