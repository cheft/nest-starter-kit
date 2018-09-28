import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '../base/service';
import { Tag } from '../entity/tag';

@Injectable()
export class TagService extends BaseService {
  constructor(@InjectRepository(Tag) protected readonly repository: Repository<Tag>) {
    super(repository);
  }
}
