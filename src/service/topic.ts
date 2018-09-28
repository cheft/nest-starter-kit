import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '../base/service';
import { Topic } from '../entity/topic';

@Injectable()
export class TopicService extends BaseService {
  constructor(@InjectRepository(Topic) protected readonly repository: Repository<Topic>) {
    super(repository);
  }
}
