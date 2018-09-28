import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Category } from './entity/category';
import { CategoryService } from './service/category';
import { CategoryController } from './controller/category';

import { Tag } from './entity/tag';
import { TagService } from './service/tag';
import { TagController } from './controller/tag';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    TypeOrmModule.forFeature([Category]),
    TypeOrmModule.forFeature([Tag]),
  ],
  providers: [
    CategoryService,
    TagService
  ],
  controllers: [
    CategoryController,
    TagController
  ]
})
export class AppModule {}
