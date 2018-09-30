import { Controller, Get, Post, Put, Delete, Param, Body, Query,
  UseGuards, UseInterceptors, FileInterceptor, UploadedFile, HttpException, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BaseController } from '../base/controller';
import { TopicService } from '../service/topic';
import upload from '../util/upload';

@Controller('topic')
export class TopicController extends BaseController {
  constructor(protected readonly service: TopicService) {
    super(service);
  }

  /**
   * 根据标签查询
   */
  @Get('tag/:tag')
  getByTag() {

  }

  /**
   * 根据用户查询
   */
  @Get('user/:uid')
  getByUser() {

  }

  /**
   * 上传图片
   * @param image
   */
  @Post('upload')
  @UseGuards(AuthGuard('bearer'))
  @UseInterceptors(FileInterceptor('image'))
  uploadFile(@UploadedFile() image) {
    return upload(image.originalname, image.buffer);
  }

  /**
   * 切换收藏
   */
  @Put('follow/:id')
  toggleFollow() {
    throw new HttpException({
      status: HttpStatus.FORBIDDEN,
      error: 'This is a custom error message',
    }, 403);
  }

  /**
   * 获取收藏的帖子
   */
  @Get(':uid/follow')
  getMyFollow() {
    throw new HttpException({
      status: HttpStatus.FORBIDDEN,
      error: 'This is a custom error message',
    }, 403);
  }

  /**
   * 切换点赞
   */
  @Put('like/:id')
  toggleLike() {

  }

  /**
   * 获取收藏的视频
   */
  @Get('uid:/video/follow')
  getVideoFollow() {

  }

  /**
   * 视频切换收藏
   */
  @Put('video/follow/:id')
  videoToggleFollow() {

  }

  /**
   * 视频切换点赞
   */
  @Put('video/like/:id')
  videoToggleLike() {

  }

}
