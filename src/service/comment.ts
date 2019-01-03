import { Injectable } from '@nestjs/common';
import { BaseService } from '../base/service';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Follow } from '../entity/follow';
import { Comment } from '../entity/comment';
import { Topic } from '../entity/topic';
import { User } from '../entity/user';

@Injectable()
export class CommentService extends BaseService {
  constructor(
    // protected readonly topic: TopicService,
    @InjectRepository(Comment) protected readonly repository: Repository<Comment>,
    @InjectRepository(User) protected readonly replyuser: Repository<User>,
    @InjectRepository(Follow) protected readonly followRepo: Repository<Follow>,
    @InjectRepository(Topic) protected readonly replytopic: Repository<Topic>,
  ) {
    super(repository);
  }

  async getByTopic(topic, query) {
    const now = new Date();
    const execTime = query.reqObj.refType === 'live' ?
      (`${now.getFullYear()}-${(now.getMonth() + 1)}-${now.getDate()} 00:00:00`)
      :'1970-01-01 00:00:00';
    let ttopic;
    if (query.reqObj.refType === 'video'  || query.reqObj.refType === 'live') {
      const queryBuilder = this.replytopic.createQueryBuilder('topic')
      .where('refType = :refType', { refType:query.reqObj.refType })
      .andWhere('refValue = :refValue', { refValue:query.reqObj.refValue });
      const vid = await queryBuilder.getMany();
      if (vid.length === 0) {
        return {
          list: [],
          count: 0,
          page: 1,
          pageSize: 10,
        };
      }
      ttopic = vid[0]['id'];
    }
    const tid = ttopic ? ttopic : topic;
    const page = parseInt(query._page || 1, 10);
    const pageSize = parseInt(query._pageSize || 10, 10);

    const queryBuilder = this.repository.createQueryBuilder('comment')
    .innerJoinAndSelect('comment.user', 'user')
    .innerJoinAndSelect('comment.topic', 'topic', 'topic.id = :tid', { tid })
    .where('comment.isReply = 0')
    .andWhere('comment.createAt > :createTime', { createTime:execTime });

    const count = await queryBuilder.getCount();
    const list = await queryBuilder.orderBy('comment.createAt', 'DESC')
      .skip((page - 1) * pageSize).take(pageSize).getMany();
    for (const key in list) {
      const queryGetReply = this.repository.createQueryBuilder('comment')
      .innerJoinAndSelect('comment.user', 'user')
      .where('comment.replyId = :rid', { rid:list[key].id })
      .andWhere('comment.isReply = 1');
      const replyInfo = await queryGetReply.orderBy('comment.createAt', 'DESC').getMany();
      list[key]['reply'] = replyInfo;
      for (const k in replyInfo) {
        const userId = replyInfo[k].replyUserId;
        const replayUserName = await this.replyuser.findOne(userId);
        if (typeof(replayUserName) !== 'undefined') {
          list[key]['reply'][k].replyUserName =  replayUserName.nickname;
        }
      }
    }

    return {
      list,
      count,
      page,
      pageSize,
    };
  }

  async toggleFollow(type, user, id) {
    const follow = await this.followRepo.findOne({
      select: ['id'],
      where: { user, followId: id, type },
    });
    let result;
    if (follow) {
      result = await this.followRepo.remove(follow);
      const queryBuilder = this.followRepo.createQueryBuilder('user_follows')
      .where('user_follows.followId = :fid', { fid:id })
      .andWhere("type = 'comment_like'");
      const count = await queryBuilder.getCount();
      this.update(id, { like:count });
    } else {
      result =  await this.followRepo.save({ user, followId: id, type });
      const queryBuilder = this.followRepo.createQueryBuilder('user_follows')
      .where('user_follows.followId = :fid', { fid:id })
      .andWhere("type = 'comment_like'");
      const count = await queryBuilder.getCount();
      this.update(id, { like:count });
      result['count'] = count;
    }
    return result;
  }

  async getByTopicAdmin(topic, query) {
    let ttopic;
    if (query.refType === 'video' || query.refType === 'live') {
      const queryBuilder = this.replytopic.createQueryBuilder('topic')
      .where('refType = :refType', { refType:query.refType })
      .andWhere('refValue = :refValue', { refValue:query.refValue });
      const vid = await queryBuilder.getMany();
      if (vid.length === 0) {
        return {
          list: [],
          count: 0,
          page: 1,
          pageSize: 10,
        };
      }
      ttopic = vid[0]['id'];
    }
    const tid = ttopic ? ttopic : topic;
    const page = parseInt(query._page || 1, 10);
    const pageSize = parseInt(query._pageSize || 10, 10);

    const queryBuilder = this.repository.createQueryBuilder('comment')
    .innerJoinAndSelect('comment.user', 'user')
    .innerJoinAndSelect('comment.topic', 'topic', 'topic.id = :tid', { tid })
    .where('comment.isReply = 0');

    const count = await queryBuilder.getCount();
    const list = await queryBuilder.orderBy('comment.createAt', 'DESC').getMany();
    for (const key in list) {
      const queryGetReply = this.repository.createQueryBuilder('comment')
      .innerJoinAndSelect('comment.user', 'user')
      .where('comment.replyId = :rid', { rid:list[key].id })
      .andWhere('comment.isReply = 1');
      const replyInfo = await queryGetReply.orderBy('comment.createAt', 'DESC').getMany();
      list[key]['reply'] = replyInfo;
      for (const k in replyInfo) {
        const userId = replyInfo[k].replyUserId;
        const replayUserName = await this.replyuser.findOne(userId);
        if (typeof(replayUserName) !== 'undefined') {
          list[key]['reply'][k].replyUserName =  replayUserName.nickname;
        }
      }
    }

    return {
      list,
      count,
      page,
      pageSize,
    };
  }

  async createComment(data, req) {
    let topicId;
    if (data.refType === 'video' || data.refType === 'live') {
      const queryBuilder = await this.replytopic.createQueryBuilder('topic')
        .where('refValue = :refValue', { refValue:data.refValue })
        .andWhere('refType = :refType', { refType:data.refType });
      const isvideo = await queryBuilder.getMany();
      console.log('-=============-', isvideo);
      if (isvideo.length > 0) {
        topicId = isvideo[0].id;
      } else {
        const updateAt = new Date();
        const commentData = {
          refValue: data.refValue,
          refType: data.refType,
          title:data.refValue,
          content:data.refValue,
          viewCount:100,
          status:0,
          createAt:updateAt,
          updateAt,
        };
        const tinfo = await this.replytopic.insert(commentData);
        console.log('iiiiiiiiiiiiiid', tinfo.identifiers[0].id);
        topicId = tinfo.identifiers[0].id;
      }
    }

    const topic = topicId ? topicId :data.topic;
    const data1 = {
      user:req.user,
      topic,
      content: data.content,
      isReply: data.isReply,
      replyId: data.replyId,
      replyUserId : data.replyUserId,
    };
    return await this.create(data1);
    // return await this.repository.insert(data1);
  }

}
