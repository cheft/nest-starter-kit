import { Controller, Get, Post, Put, Delete, Param, Body, Query, Req, Headers,
  UseGuards, UseInterceptors, FileInterceptor, UploadedFile } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { plainToClass } from 'class-transformer';
import { UserService } from '../service/user';
import { User } from '../entity/user';
import upload from '../util/upload';
import { PureController } from '../base/pure.controller';

@Controller('user')
export class UserController extends PureController {
  constructor(protected readonly service: UserService) {
    super(service);
  }

  /**
   * 注册，TODO: 短信验证
   * @param data 用户数据
   */
  @Post('register')
  register(@Body() data: User) {
    let user = plainToClass(User, data);
    return this.service.register(user);
  }

  /**
   * 登录
   * @param data 
   */
  @Post('login')
  login(@Body() data) {
    return this.service.login(data);
  }

  /**
   * 获取用户的所有 token，TODO:
   */
  @Get('tokens')
  getTokens() {}

  /**
   * 验证 token 获取用户信息，TODO:
   */
  @Post('token')
  verifyToken() {}

  /**
   * 获取当前用户信息
   */
  @Get('current')
  @UseGuards(AuthGuard('bearer'))
  current(@Req() req) {
    return req.user;
  }

  /**
   * 登出
   */
  @Get('logout')
  @UseGuards(AuthGuard('bearer'))
  logout(@Headers() header) {
    let token = header.authorization.split(' ')[1];
    return this.service.logout(token);
  }

  /**
   * 修改密码
   */
  @Put('change/password')
  @UseGuards(AuthGuard('bearer'))
  changePassword(@Req() req, @Body() data) {
    return this.service.changePassword(req.user, data);
  }

  /**
   * 重置密码，TODO: 短信验证
   */
  @Put('reset/password')
  @UseGuards(AuthGuard('bearer'))
  resetPassword(@Req() req, @Body() data) {
    return this.service.resetPassword(req, data);
  }

  @Post('batch')
  simpleInfo(@Body() data) {
    let uids = data.uids.split(',');
    return this.service.batchList(uids);
  }

   /**
   * 修改用户信息
   */
  @Put(':id')
  @UseGuards(AuthGuard('bearer'))
  update(@Param() params, @Body() data) {
    return this.service.update(params.id, data);
  }

  /**
   * 用户头像上传
   * @param image 
   */
  @Post('upload')
  @UseGuards(AuthGuard('bearer'))
  @UseInterceptors(FileInterceptor('image'))
  uploadFile(@UploadedFile() image) {
    return upload(image.originalname, image.buffer);
  }

  /**
   * 切换关注
   */
  @Post('follow/:id')
  toggleFollow() {

  }

  /**
   * 获取某用户的关注用户
   */
  @Get(':id/follow')
  getMyFollow() {

  }

  /**
   * 获取某用户的粉丝
   */
  @Get(':uid/fans')
  getMyFans() {

  }

  /**
   * 获取指定用户信息
   * @param params 
   */
  @Get(':id')
  detail(@Param() params) {
    return this.service.detail(params.id);
  }

}
