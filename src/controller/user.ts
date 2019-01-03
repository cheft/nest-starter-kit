import { Controller, Get, Post, Put, Param, Body, Query, Req, Headers,
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
    const user = plainToClass(User, data);
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
    const id = parseInt(req.user.id, 10);
    return this.service.getMoreInfo(id, undefined);
  }

  /**
   * 登出
   */
  @Get('logout')
  @UseGuards(AuthGuard('bearer'))
  logout(@Headers() header) {
    const token = header.authorization.split(' ')[1];
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
  resetPassword(@Body() data) {
    return this.service.resetPassword(data);
  }

  /**
   * 批量获取用户基本信息
   * @param data
   */
  @Post('batch')
  simpleInfo(@Body() data) {
    const uids = data.uids.split(',');
    return this.service.batchList(uids);
  }

  /**
   * 修改当前用户信息
   */
  @Put('current')
  @UseGuards(AuthGuard('bearer'))
  update(@Req() req, @Body() data) {
    data.updateAt = new Date();
    return this.service.userUpdate(req.user.id, data);
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
  @Put('follow/:id')
  @UseGuards(AuthGuard('bearer'))
  toggleFollow(@Req() req, @Param() param) {
    return this.service.toggleFollow(req.user, parseInt(param.id, 10));
  }

  /**
   * 获取某用户的粉丝
   */
  @Get(':id/fans')
  getFans(@Param() param, @Query() query) {
    return this.service.getFans(parseInt(param.id, 10), query);
  }

  /**
   * 获取某用户关注的用户
   */
  @Get(':id/follow')
  getFollow(@Param() param, @Query() query) {
    return this.service.getFollow(parseInt(param.id, 10), query);
  }

  @Post('phone')
  findPhone(@Body() data) {
    return this.service.phone(data);
  }

  /**
   * 获取用户最后访问时间
   */
  @Get('visittime')
  @UseGuards(AuthGuard('bearer'))
  findVisitTime(@Req() req, @Body() data) {
    return this.service.findVisit(req, data);
  }

  /**
   * 更新用户最后访问时间
   */
  @Post('updatetime')
  @UseGuards(AuthGuard('bearer'))
  updateVisitTime(@Req() req, @Body() data) {
    return this.service.updateVisit(req, data);
  }

  /**
   * 获取指定用户信息
   * @param params
   */
  @Get(':id')
  detail(@Param() param, @Query() query) {
    const id = parseInt(param.id, 10);
    const loginUserId = parseInt(query.loginuser, 10);
    return this.service.getMoreInfo(id, loginUserId);
  }
}
