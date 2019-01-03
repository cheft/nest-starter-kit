import { Controller , Post, Body, Get, Req, Param, Query, Put, UseGuards } from '@nestjs/common';
import { PureController } from '../base/pure.controller';
import { AuthGuard } from '@nestjs/passport';
import { CommentService } from '../service/comment';

@Controller('admin/comment')
export class AdminCommentController extends PureController {
  constructor(protected readonly service: CommentService) {
    super(service);
  }

  @Post()
    @UseGuards(AuthGuard('bearer'))
    create(@Body() data, @Req() req) {
    data.user = req.user;
    return this.service.create(data);
  }

  @Get('topic/:topic')
    getByTopic(@Param() param, @Query() query) {
    const topicId = parseInt(param.topic, 10);
    return this.service.getByTopicAdmin(topicId, query);
  }

  @Put('like/:id')
    @UseGuards(AuthGuard('bearer'))
    toggleLike(@Req() req, @Param() param) {
    const id = parseInt(param.id, 10);
    return this.service.toggleFollow('comment_like', req.user, id);
  }

  @Put('shield')
    shield(@Body() body) {
    return this.service.update(body.cid, body);
  }
}
