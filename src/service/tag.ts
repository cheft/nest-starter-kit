import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '../base/service';
import { Tag } from '../entity/tag';

@Injectable()
export class TagService extends BaseService {
  constructor(@InjectRepository(Tag) protected readonly repository: Repository<Tag>) {
    super(repository);
  }

  async getTagsByLevel(query) {
    const level = parseInt(query.level, 10);
    const pid = parseInt(query.pid, 10);
    let queryBuilder = this.repository.createQueryBuilder('tag').where('1=1');
    if (level !== 0) {
      queryBuilder = queryBuilder.andWhere('tag.level = :level', { level });
    }
    if (pid) {
      queryBuilder = queryBuilder.andWhere('tag.pid = :pid', { pid });
    }
    return queryBuilder.getMany();
  }

  async isAsTopic(query) {
    debugger;
    const id = parseInt(query.tid, 10);
    if (id) {
      const tag = await this.repository.createQueryBuilder().select('topic_tag')
        .from('topic_tag', 'tt').where('tt.tagId = :id', { id }).getCount();
      return tag;
    }
  }

  async remove(id) {
    if (id < 5) {
      throw new HttpException('一级标签不能删除', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    await this.repository.createQueryBuilder()
      .delete()
      .from('topic_tag')
      .where('tagId = :id', { id })
      .execute();
    const toRemove = await this.repository.findOne(id);
    const result = await this.repository.remove(toRemove);
    return result;
  }
}
