import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '../base/service';
import { User } from '../entity/user';
import { Token } from '../entity/token';

@Injectable()
export class UserService extends BaseService {
  constructor(
    @InjectRepository(User) protected readonly repository: Repository<User>,
    @InjectRepository(Token) protected readonly tokenRepo: Repository<Token>,
  ) {
    super(repository)
  }

  async login(data) {
    let user = await this.repository.findOne({
      select: ['id', 'password'],
      where: { username: data.username }
    });
    if (user.password === data.password) {
      let token = new Token();
      token.user = user;
      return await this.tokenRepo.save(token);
    }
    return {};
  }
}
