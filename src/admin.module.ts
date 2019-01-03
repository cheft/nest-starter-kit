import { Module, HttpModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './entity/user';
import { AdminUserService } from './service/admin.user';
import { AdminUserController } from './controller/admin.user';

import { Topic } from './entity/topic';
import { Tag } from './entity/tag';

import { AdminTopicService } from './service/admin.topic';
import { AdminTopicController } from './controller/admin.topic';

import { Swiper } from './entity/swiper';
import { AdminSwiperController } from './controller/admin.swiper';
import { AdminSwiperService } from './service/admin.swiper';

import { AdminVideoController } from './controller/admin.video';
import { AdminVideoService } from './service/admin.video';

import { AdminCommentController } from './controller/admin.comment';
import { CommentService } from './service/comment';
import { Comment } from './entity/comment';

import { Follow } from './entity/follow';
import { AdminTagController } from './controller/admin.tag';
import { TagService } from './service/tag';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Topic]),
    TypeOrmModule.forFeature([Tag]),
    TypeOrmModule.forFeature([Swiper]),
    TypeOrmModule.forFeature([Comment]),
    TypeOrmModule.forFeature([Follow]),

    HttpModule,
  ],

  providers: [
    AdminUserService,
    AdminTopicService,
    AdminSwiperService,
    AdminVideoService,
    TagService,
    CommentService,
  ],

  controllers: [
    AdminUserController,
    AdminTopicController,
    AdminSwiperController,
    AdminVideoController,
    AdminTagController,
    AdminCommentController,
  ],
})
export class AdminModule {}
