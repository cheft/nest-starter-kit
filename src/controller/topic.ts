import { Controller, Get, Post, Put, Delete, Param, Body, Query,
  UseGuards, Req, UseInterceptors, FileInterceptor, UploadedFile } from '@nestjs/common';
import { User } from '../entity/user';
import { AuthGuard } from '@nestjs/passport';
import { PureController } from '../base/pure.controller';
import { TopicService } from '../service/topic';
import { Category } from '../entity/category';
import upload from '../util/upload';

@Controller('topic')
export class TopicController extends PureController {
  constructor(protected readonly service: TopicService) {
    super(service);
  }

  /**
   * 发布文章
   * @param data
   * @param req
   */
  @Post()
  @UseGuards(AuthGuard('bearer'))
  create(@Body() data, @Req() req) {
    const category = new Category();
    category.id = 1;
    data.category = category;
    data.user = req.user;
    return this.service.create(data);
  }

  /**
   * 更新文章
   * @param params
   * @param data
   */
  @Put(':id')
  @UseGuards(AuthGuard('bearer'))
  update(@Param() params, @Body() data) {
    data.updateAt = new Date();
    return this.service.update(params.id, data);
  }

  /**
   * 删除文章
   * @param params
   */
  @Delete(':id')
  @UseGuards(AuthGuard('bearer'))
  remove(@Param() params) {
    return this.service.remove(params.id);
  }

  /**
   * 根据标签查询
   */
  @Get('tag/:tag')
  getByTag(@Param() param, @Query() query) {
    const tagId = parseInt(param.tag || 0, 10);
    return this.service.getByTag(tagId, query);
  }

  /**
   * 根据用户查询已发布文章
   */
  @Get('user/:uid')
  getByUser(@Param() param, @Query() query) {
    const user = new User();
    user.id = parseInt(param.uid || 0, 10);
    return this.service.getByUserAndStatus(user, 1, query);
  }

  /**
   * 根据用户查询未发布的文章
   */
  @Get('my/unpublish')
  @UseGuards(AuthGuard('bearer'))
  getMyUnPublish(@Req() req, @Query() query) {
    return this.service.getByUserAndStatus(req.user, 0, query);
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
   * 增加一次浏览量，TODO: 考虑 IP、时间防刷
   */
  @Put('plusviewcount/:id')
  plusViewCount(@Param() param) {
    const id = parseInt(param.id, 10);
    return this.service.plusViewCount(id);
  }

  /**
   * 切换收藏
   */
  @Put('follow/:id')
  @UseGuards(AuthGuard('bearer'))
  toggleFollow(@Req() req, @Param() param) {
    const id = parseInt(param.id, 10);
    return this.service.toggleFollow('topic_follow', req.user, id);
  }

  /**
   * 获取收藏的帖子
   */
  @Get(':uid/follow')
  getFollow(@Param() param, @Query() query) {
    return this.service.getFollow('topic_follow', parseInt(param.uid, 10), query);
  }

  /**
   * 切换点赞
   */
  @Put('like/:id')
  @UseGuards(AuthGuard('bearer'))
  toggleLike(@Req() req, @Param() param) {
    const id = parseInt(param.id, 10);
    return this.service.toggleFollow('topic_like', req.user, id);
  }

  /**
   * 获取收藏的视频
   */
  @Get(':uid/video/follow')
  getVideoFollow(@Param() param, @Query() query) {
    return this.service.getFollow('video_follow', parseInt(param.uid, 10), query);
  }

  /**
   * 视频切换收藏
   */
  @Put('video/follow')
  @UseGuards(AuthGuard('bearer'))
  videoToggleFollow(@Req() req, @Body() body) {
    return this.service.videoHandle('video_follow', req.user, body);
  }

  /**
   * 视频切换点赞
   */
  @Put('video/like')
  @UseGuards(AuthGuard('bearer'))
  videoToggleLike(@Req() req, @Body() body) {
    return this.service.videoHandle('video_like', req.user, body);
  }

  /**
   * 获取视频点赞收藏信息
   * @param params 文章 id
   */
  @Get('/video/info')
  videoInfo(@Query() query) {
    const uid = parseInt(query.uid, 10);
    return this.service.getVideoInfo(query.vid, uid);
  }

  /**
   * 获取文章
   * @param params 文章 id
   */
  @Get(':id')
  details(@Param() param, @Query() query) {
    const id = parseInt(param.id, 10);
    const uid = parseInt(query.uid, 10);
    return this.service.getMoreInfo(id, uid);
  }

  /**
   * 隐藏文章
   * @param id 文章id
   */
  @Put('hidden/:id')
  deleteTopic(@Param() param) {
    const topicId = parseInt(param.id, 10);
    const data = { status:2 };
    return this.service.update(topicId, data);
  }
}
