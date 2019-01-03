import { Controller, Post , Body , Get, Req, Param, Query, Put, UseGuards } from '@nestjs/common';
import { PureController } from '../base/pure.controller';
import { AuthGuard } from '@nestjs/passport';
import { CommentService } from '../service/comment';
import { TopicService } from '../service/topic';

@Controller('comment')
export class CommentController extends PureController {
  constructor(
        protected readonly service: CommentService,
        protected readonly topic: TopicService,
        ) {
    super(service);
  }

  @Post()
    @UseGuards(AuthGuard('bearer'))
    async create(@Body() data, @Req() req) {
    return this.service.createComment(data, req);
  }

  @Get('topic/:topic')
    getByTopic(@Param() param, @Query() query) {
    const topicId = parseInt(param.topic, 10);
    return this.service.getByTopic(topicId, query);
  }

  @Put('like/:id')
    @UseGuards(AuthGuard('bearer'))
    toggleLike(@Req() req, @Param() param) {
    const id = parseInt(param.id, 10);
    return this.service.toggleFollow('comment_like', req.user, id);
  }
}
