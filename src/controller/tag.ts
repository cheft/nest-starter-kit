import { Controller, Get, Post, Put, Delete, Param, Body, Query } from '@nestjs/common';
import { BaseController } from '../base/controller';
import { TagService } from '../service/tag';

@Controller('tag')
export class TagController extends BaseController {
  constructor(protected readonly service: TagService) {
    super(service);
  }
}
