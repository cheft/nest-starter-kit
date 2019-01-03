import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '../base/service';
import { Topic } from '../entity/topic';
import { Category } from '../entity/category';
import { Tag } from '../entity/tag';

@Injectable()
export class AdminTopicService extends BaseService {
  constructor(
    @InjectRepository(Topic) protected readonly repository: Repository<Topic>,
    @InjectRepository(Tag) protected readonly tagRepos: Repository<Tag>,
  ) {
    super(repository);
  }

  async audit(id, status) {
    if (status !== -1 && status !== 1) {
      throw new HttpException('status 传入参数错误', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    const topic = await this.repository.findOne(id);
    topic.status = status;
    topic.auditAt = new Date();
    return topic;
  }
  /**
   * 分页查询
   * @param user
   * @param status
   * @param query
   */
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
      page,
      pageSize,
      list: result[0],
      count: result[1],
    };
  }

  //  /**
  //  * 根据条件查询列表
  //  * @param query 查询条件
  //  */
  // async list(query) {
  //   const page = parseInt(query._page || 1, 10);
  //   const pageSize = parseInt(query._pageSize || 10, 10);
  //   delete query._page
  //   delete query._pageSize

  //   let order = {};
  //   if (query._order) {
  //     const tmp = query._order.split('_');
  //     order[tmp[0]] = tmp[1].toUpperCase();
  //     delete query._order;
  //   } else {
  //     order = { updateAt: 'DESC'};
  //   }

  //   const result = await this.repository.findAndCount({
  //     where: query,
  //     take: pageSize,
  //     skip: (page - 1) * pageSize,
  //     order: order,
  //   });

  //   return {
  //     list: result[0],
  //     count: result[1],
  //     page: page,
  //     pageSize: pageSize,
  //   }
  // }

  async search(query) {
    const page = parseInt(query._page || 1, 10);
    const pageSize = parseInt(query._pageSize || 10, 10);
    delete query._page;
    delete query._pageSize;

    const orderField = 'updateAt';
    const orderRule = 'DESC';
    let statusSql = '';
    let keywordSql = '';
    let uidSql = '';
    let tagSql = '';
    let havingSql = '';

    if (query.status) {
      statusSql = `AND topic.status = ${query.status}`;
    }
    if (query.keyword) {
      keywordSql = `AND (topic.title like '%${query.keyword}%'
        or topic.content like '%${query.keyword}%')`;
    }
    if (query.uid) {
      uidSql = `AND topic.uid = ${query.uid}`;

    }
    if (query.tagId && query.tagId.length) {
      query.tagId.map((val) => {
        return parseInt(val, 10);
      });
      tagSql = `AND t2.tagId IN (${query.tagId.join(',')})`;
      havingSql = `HAVING COUNT(DISTINCT topic.id, t2.tagId) = ${query.tagId.length}`;
    }

    const sql = `SELECT topic.id FROM topic LEFT JOIN topic_tag t2 ON t2.topicId = topic.id
    WHERE topic.cid = 1 ${statusSql} ${keywordSql} ${uidSql} ${tagSql}
    GROUP BY topic.id ${havingSql} order by topic.${orderField} ${orderRule}
    LIMIT ${(page - 1) * pageSize} , ${pageSize}`;

    const countSql = `SELECT count(1) AS num FROM
      (SELECT topic.id from topic LEFT JOIN topic_tag t2 ON t2.topicId = topic.id
      WHERE topic.cid = 1 ${statusSql} ${keywordSql} ${uidSql} ${tagSql}
      GROUP BY topic.id ${havingSql} order by topic.updateAt)  count`;

    const topics = await this.repository.query(sql);

    const list = [];
    for (let i = 0; i < topics.length; i++) {
      list.push(await this.repository.findOne(topics[i].id));
    }

    const result = await this.repository.query(countSql);
    const count = parseInt(result[0].num, 10);
    return {
      list,
      count,
      page,
      pageSize,
    };
  }

  async search2(query) {
    const page = parseInt(query._page || 1, 10);
    const pageSize = parseInt(query._pageSize || 10, 10);
    delete query._page;
    delete query._pageSize;

    const orderField = 'updateAt';
    const orderRule = 'DESC';

    let queryBuilder = this.repository.createQueryBuilder('topic')
    .leftJoinAndSelect('topic.user', 'user')
    .leftJoinAndSelect('topic.category', 'category')
    .leftJoinAndSelect('topic.tags', 'tag')
    .where('category.id = 1');
    if (query.tagId && query.tagId.length) {
      query.tagId.map((val) => {
        return parseInt(val, 10);
      });
      queryBuilder = queryBuilder.leftJoin('topic_tag', 'tt', 'tt.topicId = topic.id')
      .where('tt.tagId IN (:tagId) ', { tagId: query.tagId });
    }
    if (query.status) {
      queryBuilder = queryBuilder.andWhere('topic.status = :status',
                                           { status: parseInt(query.status, 10) });
    }
    if (query.keyword) {
      queryBuilder = queryBuilder.andWhere('topic.title like :keyword' +
        'or topic.content like :keyword',
                                           { keyword: `%${query.keyword}%` });
    }
    if (query.uid) {
      queryBuilder = queryBuilder.andWhere('topic.user.id = :id ', { id: query.uid });
    }

    const count = await queryBuilder.getCount();
    const list = await queryBuilder.orderBy(
      'topic.' + orderField, orderRule === 'DESC' ? 'DESC' : 'ASC')
    .skip((page - 1) * pageSize).take(pageSize).getMany();

    return {
      list,
      count,
      page,
      pageSize,
    };
  }

  async getAllTags() {
    return await this.tagRepos.find();
  }
}
