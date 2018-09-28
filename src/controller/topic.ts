import { Controller, Get, Post, Put, Delete, Param, Body, Query } from '@nestjs/common';
import { BaseController } from '../base/controller';
import { TopicService } from '../service/topic';

@Controller('topic')
export class TopicController extends BaseController {
  constructor(protected readonly service: TopicService) {
    super(service);
  }
}
