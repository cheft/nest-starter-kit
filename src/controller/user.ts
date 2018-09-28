import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BaseController } from '../base/controller';
import { UserService } from '../service/user';

@Controller('user')
export class UserController extends BaseController {
  constructor(protected readonly service: UserService) {
    super(service);
  }

  @Get()
  @UseGuards(AuthGuard('bearer'))
  list(query) {
    return super.list(query);
  }
}
