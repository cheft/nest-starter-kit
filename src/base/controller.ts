import { Get, Post, Put, Delete, Param, Query, Body } from '@nestjs/common';

/**
 * Controller 基类
 * 基于 restful 标准的路由规则
 */
export class BaseController {
  constructor(protected readonly service) {}

  @Get()
  list(@Query() query) {
    return this.service.list(query);
  }

  @Get('/:id')
  one(@Param() params) {
    return this.service.one(params.id);
  }

  @Post()
  create(@Body() data) {
    return this.service.create(data);
  }

  @Put('/:id')
  update(@Param() params, @Body() data) {
    return this.service.update(params.id, data);
  }

  @Delete('/:id')
  remove(@Param() params) {
    return this.service.remove(params.id);
  }
}
