import { Controller, UseGuards, Get, Post, Put, Delete, Param, Body, Query, Session,
  UseInterceptors, FileInterceptor, UploadedFile } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { SessionGuard } from '../guard/session.guard';
import { BaseController } from '../base/controller';
import { User } from '../entity/user';
import { AdminUserService } from '../service/admin.user';
import upload from '../util/upload';

@Controller('admin/user')
export class AdminUserController extends BaseController {
  constructor(protected readonly service: AdminUserService) {
    super(service);
  }

  /**
   * 登录
   * @param data
   */
  @Post('login')
  async login(@Body() data, @Session() session) {
    const user = await this.service.login(data);
    session.user = user;
    return user;
  }

  /**
   * 登出
   */
  @Get('logout')
  @UseGuards(SessionGuard)
  logout(@Session() session) {
    delete session.user;
    return {};
  }

  /**
   * 获取当前用户信息
   */
  @Get('current')
  @UseGuards(SessionGuard)
  getCurrent(@Session() session) {
    return session.user;
  }

  /**
   * 用户头像上传
   * @param image
   */
  @Post('upload')
  @UseGuards(SessionGuard)
  @UseInterceptors(FileInterceptor('image'))
  uploadFile(@UploadedFile() image) {
    return upload(image.originalname, image.buffer);
  }

  @Post('/')
  @UseGuards(SessionGuard)
  create(@Body() data) {
    const user = plainToClass(User, data);
    return this.service.create(user);
  }

  @Get()
  @UseGuards(SessionGuard)
  list(@Query() query) {
    return this.service.search(query);
  }

  @Put(':id')
  @UseGuards(SessionGuard)
  update(@Param() params, @Body() data) {
    return this.service.update(params.id, data);
  }

  /**
   * 删除用户，TODO: 删除用户关系的所有数据
   * @param params
   */
  @Delete(':id')
  @UseGuards(SessionGuard)
  remove(@Param() params) {
    return this.service.remove(params.id);
  }

  @Get(':id')
  @UseGuards(SessionGuard)
  detail(@Param() params) {
    return this.service.detail(params.id);
  }

}
