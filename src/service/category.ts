import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '../base/service';
import { Category } from '../entity/category';

@Injectable()
export class CategoryService extends BaseService {
  constructor(@InjectRepository(Category) protected readonly repository: Repository<Category>) {
    super(repository);
  }
}
