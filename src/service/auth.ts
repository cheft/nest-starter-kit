import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-http-bearer';
import { Token } from '../entity/token';

@Injectable()
export class AuthService extends PassportStrategy(Strategy) {
  constructor(@InjectRepository(Token) private readonly repository: Repository<Token>) {
    super();
  }

  // TODO: token 管理
  async validate(token, done) {
    const instance = await this.repository.findOne(token);
    // const instance = await this.repository.createQueryBuilder('token')
    // .leftJoinAndSelect('token.user', 'user')
    // .where('token.id = :id', { id: token }).getOne();

    if (instance && instance.user) {
      return done(null, instance.user);
    }
    
    done(new UnauthorizedException(), false);
  }

}
