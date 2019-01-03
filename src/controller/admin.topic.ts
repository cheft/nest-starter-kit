import { Controller, UseGuards, Get, Post, Put, Delete, Param, Body, Query,
  Session, UseInterceptors, FileInterceptor, UploadedFile } from '@nestjs/common';
import { SessionGuard } from '../guard/session.guard';
import { BaseController } from '../base/controller';
import { AdminTopicService } from '../service/admin.topic';
import upload from '../util/upload';
import { User } from '../entity/user';

@Controller('admin/topic')
export class AdminTopicController extends BaseController {
  constructor(protected readonly service: AdminTopicService) {
    super(service);
  }

  /**
   * 新增文章
   * @param session
   * @param data
   */
  @Post()
  @UseGuards(SessionGuard)
  createTopic(@Session() session, @Body() data) {
    data.user = session.user;
    this.service.create(data);
  }

  /**
   * 审核文章
   * @param param
   * @param body
   */
  @Put('audit/:id')
  @UseGuards(SessionGuard)
  audit(@Param() param, @Body() body) {
    const id = parseInt(param.id, 10);
    const status = parseInt(body.status, 10);
    return this.service.audit(id, status);
  }

  /**
   * 上传图片
   * @param image
   */
  @Post('upload')
  @UseGuards(SessionGuard)
  @UseInterceptors(FileInterceptor('image'))
  uploadFile(@UploadedFile() image) {
    return upload(image.originalname, image.buffer);
  }

  /**
   * 更新文章
   * @param params 文章id
   * @param data
   */
  @Put(':id')
  @UseGuards(SessionGuard)
  update(@Param() params, @Body() data) {
    data.updateAt = new Date();
    return this.service.update(params.id, data);
  }

  /**
   * 删除文章
   * @param params
   */
  @Delete(':id')
  @UseGuards(SessionGuard)
  remove(@Param() params) {
    return this.service.remove(params.id);
  }

  /**
   * 根据用户查询已文章
   */
  @Get('user/:uid')
  @UseGuards(SessionGuard)
  getByUser(@Param() param, @Query() query) {
    const user = new User();
    user.id = parseInt(param.uid || 0, 10);
    return this.service.getByUserAndStatus(user, 1, query);
  }

  @Get()
  list(@Query() query) {
    return this.service.search(query);
  }

  @Get('tags')
  @UseGuards(SessionGuard)
  getAllTags() {
    return this.service.getAllTags();
  }

}
