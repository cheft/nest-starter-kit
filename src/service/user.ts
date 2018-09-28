import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '../base/service';
import { User } from '../entity/user';

@Injectable()
export class UserService extends BaseService {
  constructor(@InjectRepository(User) protected readonly repository: Repository<User>) {
    super(repository);
  }
}
