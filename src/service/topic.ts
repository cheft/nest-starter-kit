import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '../base/service';
import { Topic } from '../entity/topic';
import { User } from '../entity/user';
import { Follow } from '../entity/follow';
import { Category } from '../entity/category';

@Injectable()
export class TopicService extends BaseService {
  constructor(
    @InjectRepository(Topic) protected readonly repository: Repository<Topic>,
    @InjectRepository(Follow) protected readonly followRepo: Repository<Follow>,
  ) {
    super(repository);
  }

  async getByTag(tagId, query) {
    const page = parseInt(query._page || 1, 10);
    const pageSize = parseInt(query._pageSize || 10, 10);

    let queryBuilder = this.repository.createQueryBuilder('topic')
    .leftJoinAndSelect('topic.user', 'user')
    .leftJoinAndSelect('topic.category', 'category')
    .leftJoinAndSelect('topic.tags', 'tag')
    .where('category.id = 1');

    if (tagId !== 0) {
      queryBuilder = queryBuilder.leftJoin('topic_tag', 'tt', 'tt.topicId = topic.id')
        .where('tt.tagId = :tagId', { tagId });
    }
    queryBuilder = queryBuilder.andWhere('topic.status = 1');

    const count = await queryBuilder.getCount();
    const list = await queryBuilder.orderBy('topic.createAt', 'DESC')
      .skip((page - 1) * pageSize).take(pageSize).getMany();

    return {
      list,
      count,
      page,
      pageSize,
    };
  }

  async getByUserAndStatus(user, status, query) {
    const page = parseInt(query._page || 1, 10);
    const pageSize = parseInt(query._pageSize || 10, 10);

    const category = new Category();
    category.id = 1;

    const result = await this.repository.findAndCount({
      where: { category, user, status },
      take: pageSize,
      skip: (page - 1) * pageSize,
      order: { createAt: 'DESC' },
    });

    return {
      list: result[0],
      count: result[1],
      page,
      pageSize,
    };
  }

  async plusViewCount(id) {
    const topic = await this.repository.findOne(id);
    topic.viewCount = topic.viewCount + 1;
    topic.visitCount = topic.visitCount + Math.floor(Math.random() * 11) + 10;
    return await this.repository.save(topic);
  }

  async toggleFollow(type, user, id) {
    const follow = await this.followRepo.findOne({
      select: ['id'],
      where: { user, followId: id, type },
    });

    if (follow) {
      return await this.followRepo.remove(follow);
    }

    return await this.followRepo.save({ user, followId: id, type });
  }

  async getFollow(type, id, query) {
    const page = parseInt(query._page || 1, 10);
    const pageSize = parseInt(query._pageSize || 10, 10);

    const user = new User();
    user.id = id;

    const result = await this.followRepo.findAndCount({
      select: ['id', 'followId', 'createAt'],
      where: { user, type },
      take: pageSize,
      skip: (page - 1) * pageSize,
      order: {
        createAt: 'DESC',
      },
    });

    const list = [];
    for (let i = 0; i < result[0].length; i++) {
      list.push(await this.repository.findOne({
        where: { id: result[0][i].followId },
      }));
    }

    return {
      list,
      count: result[1],
      page,
      pageSize,
    };
  }

  async videoInfoUpdate(user, data) {
    let topic = await this.repository.findOne({
      where: { refType: 'video', refValue: data.refValue },
    });
    if (topic) {
      data.updateAt = new Date();
      Object.assign(topic, data);
    } else {
      topic = data;
      topic.refType = 'video';
      topic.user = user;
    }
    return await this.repository.save(topic);
  }

  async videoHandle(type, user, data) {
    const topic = await this.videoInfoUpdate(user, data);
    return await this.toggleFollow(type, user, topic.id);
  }

  // 获取文章/视频的收藏点赞信息
  async getFollowLikeInfo(id, uid, type) {
    const followCount = await this.followRepo.count({
      select: ['id'],
      where: { type: type + '_follow', followId: id },
    });
    const likeCount = await this.followRepo.count({
      select: ['id'],
      where: { type: type + '_like', followId: id },
    });
    let isFollow = false;
    let isLike = false;
    if (uid) {
      const user = new User();
      user.id = uid;
      let count = await this.followRepo.count({
        where: { type: type + '_follow', followId: id, user },
      });
      isFollow = count > 0 ? true : false;
      count = await this.followRepo.count({
        where: { type: type + '_like', followId: id, user },
      });
      isLike = count > 0 ? true : false;
    }
    return {
      followCount,
      likeCount,
      isFollow,
      isLike,
    };
  }

  async getMoreInfo(id, uid) {
    const topic = await this.repository.findOne(id);
    const info = await this.getFollowLikeInfo(id, uid, 'topic');
    if (id && uid) Object.assign(topic, info);
    return topic;
  }

  async getVideoInfo(vid, uid) {
    const topic = await this.repository.findOne({
      where: { refType: 'video', refValue: vid },
    });
    if (!topic) {
      return {
        followCount: 0, likeCount: 0, isFollow: false, isLike: false,
      };
    }
    return await this.getFollowLikeInfo(topic.id, uid, 'video');
  }
}
