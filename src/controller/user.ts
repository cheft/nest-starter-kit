import { Controller, Get, Post, Put, Delete, Param, Body, Query, Req,
  UseGuards, UseInterceptors, FileInterceptor, UploadedFile, HttpException, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from '../service/user';
import upload from '../util/upload';

@Controller('user')
export class UserController {
  constructor(protected readonly service: UserService) {}

  @Get()
  @UseGuards(AuthGuard('bearer'))
  list(@Query() query, @Req() req) {
    console.log('current user:', req.user);
    return this.service.list(query);
  }

  @Post()
  register(@Body() data) {
    return this.service.create(data);
  }

  @Post('login')
  login(@Body() data) {
    return this.service.login(data);
  }

  @Post('upload')
  @UseGuards(AuthGuard('bearer'))
  @UseInterceptors(FileInterceptor('image'))
  uploadFile(@UploadedFile() image) {
    return upload(image.originalname, image.buffer);
  }
}
