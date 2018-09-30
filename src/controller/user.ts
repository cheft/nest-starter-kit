import { Controller, Get, Post, Put, Delete, Param, Body, Query, Req,
  UseGuards, UseInterceptors, FileInterceptor, UploadedFile } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
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
   * 获取所有用户
   * @param query 条件
   * @param req request
   */
  @Get()
  @UseGuards(AuthGuard('bearer'))
  list(@Query() query, @Req() req) {
    console.log('current user:', req.user);
    return this.service.list(query);
  }

  /**
   * 获取用户信息
   * @param params 
   */
  @Get(':id')
  detail(@Param() params) {
    return this.service.detail(params.id);
  }

  @Get('batch')
  simpleInfo(@Param() params) {
    return this.service.detail(params.id);
  }

   /**
   * 更新信息
   */
  @Put(':id')
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
   * 注册
   * @param data 用户数据
   */
  @Post()
  register(@Body() data: User) {
    return this.service.create(data);
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
   * 获取用户的所有 token
   */
  @Get('tokens')
  getTokens() {

  }

  /**
   * 验证 token 获取用户信息
   */
  @Post('token')
  verifyToken() {

  }

  /**
   * 登出并删除 token
   */
  @Get('logout')
  logout() {

  }

  /**
   * 重置密码
   */
  @Post('reset/password')
  resetPassword() {
    
  }

}
