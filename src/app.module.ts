import { Module } from '@nestjs/common';
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

import { Follow } from './entity/follow';

import { Token } from './entity/token';
import { AuthService } from './service/auth';

import { Comment } from './entity/comment';
import { CommentController } from './controller/comment';
import { CommentService } from './service/comment';

import { Swiper } from './entity/swiper';

// import { AdminModule } from './admin.module';
import { SwiperService } from './service/swiper';
import { SwiperController } from './controller/swiper';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    TypeOrmModule.forFeature([Category]),
    TypeOrmModule.forFeature([Tag]),
    TypeOrmModule.forFeature([Topic]),
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Token]),
    TypeOrmModule.forFeature([Follow]),
    TypeOrmModule.forFeature([Comment]),
    TypeOrmModule.forFeature([Swiper]),

    // AdminModule,
  ],
  providers: [
    CategoryService,
    TagService,
    TopicService,
    UserService,
    AuthService,
    CommentService,
    SwiperService,
  ],
  controllers: [
    CategoryController,
    TagController,
    TopicController,
    UserController,
    CommentController,
    SwiperController,
  ],
})

export class AppModule {}
