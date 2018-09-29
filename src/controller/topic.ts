import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards, UseInterceptors, FileInterceptor, UploadedFile } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BaseController } from '../base/controller';
import { TopicService } from '../service/topic';
import upload from '../util/upload';

@Controller('topic')
export class TopicController extends BaseController {
  constructor(protected readonly service: TopicService) {
    super(service);
  }

  @Post('upload')
  @UseGuards(AuthGuard('bearer'))
  @UseInterceptors(FileInterceptor('image'))
  uploadFile(@UploadedFile() image) {
    return upload(image.originalname, image.buffer);
  }
}
