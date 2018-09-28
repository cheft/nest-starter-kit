import { Controller, Get, Post, Put, Delete, Param, Body, Query } from '@nestjs/common';
import { BaseController } from '../base/controller';
import { CategoryService } from '../service/category';

@Controller('category')
export class CategoryController extends BaseController {
  constructor(protected readonly service: CategoryService) {
    super(service);
  }
}
