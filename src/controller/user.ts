import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BaseController } from '../base/controller';
import { UserService } from '../service/user';

@Controller('user')
export class UserController {
  constructor(protected readonly service: UserService) {}

  @Get()
  @UseGuards(AuthGuard('bearer'))
  list(@Query() query, @Req() req) {
    console.log('current user:', req.user);
    return this.service.list(query);
  }

  @Post('/login')
  login(@Body() data) {
    return this.service.login(data);
  }
  
}
