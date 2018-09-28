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

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    TypeOrmModule.forFeature([Category]),
    TypeOrmModule.forFeature([Tag]),
    TypeOrmModule.forFeature([Topic]),
  ],
  providers: [
    CategoryService,
    TagService,
    TopicService,
  ],
  controllers: [
    CategoryController,
    TagController,
    TopicController,
  ]
})
export class AppModule {}
