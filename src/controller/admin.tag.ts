import { Controller, Get, Delete, Param, Query } from '@nestjs/common';
import { BaseController } from '../base/controller';

import { TagService } from '../service/tag';

@Controller('admin/tag')
// @UseGuards(SessionGuard)
export class AdminTagController extends BaseController {
  constructor(protected readonly service: TagService) {
    super(service);
  }

  @Get('level')
  getAllTags(@Query() query) {
    return this.service.getTagsByLevel(query);
  }

  @Delete(':id')
  remove(@Param() params) {
    return this.service.remove(params.id);
  }

  @Get('count')
  getIsAS(@Query() query) {
    return this.service.isAsTopic(query);
  }

}
