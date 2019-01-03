import { Controller, Get, Param, Query } from '@nestjs/common';
import { AdminVideoService } from '../service/admin.video';

@Controller('admin/video')
export class AdminVideoController {
  constructor(protected readonly service: AdminVideoService) {
    // super(service);
  }

  @Get('tag/:name')
  getAllByTag(@Param() param, @Query() query) {
    return this.service.getAllByTag(param.name, query);
  }

  @Get('class')
  getClassification() {
    return this.service.getClassification();
  }

  @Get('treeid/:treeId')
  getAll(@Param() param, @Query() query) {
    return this.service.getAll(param.treeId, query);
  }

  @Get('vid/:vid')
  getConnection(@Param() param) {
    return this.service.getOne(param.vid);
  }
}
