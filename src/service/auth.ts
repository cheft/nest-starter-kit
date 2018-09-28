import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PassportStrategy } from '@nestjs/passport';
import {Strategy} from 'passport-http-bearer';
import { User } from '../entity/user';

@Injectable()
export class AuthService extends PassportStrategy(Strategy) {
  constructor(@InjectRepository(User) private readonly repository: Repository<User>) {
    super();
  }

  // TODO: token 管理, 暂时用用户 id 代替
  async validate(token, done) {
    const user = await this.repository.findOne(token);
    if (!user) {
      return done(new UnauthorizedException(), false);
    }
    done(null, user);
  }

}
