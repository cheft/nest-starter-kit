import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
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
      where: { phone: data.phone }
    });
    if (!user) {
      throw new HttpException('用户不存在', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    let verify = await user.verifyPassword(data.password);
    if (!verify) {
      throw new HttpException('密码错误', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    let token = new Token();
    token.user = user;
    let result = await this.tokenRepo.save(token);
    delete result.user.password;
    return result;
  }

  async register(user) {
    let result = await this.repository.findOne({
      select: ['id'],
      where: { phone: user.phone }
    });
    if (result) {
      throw new HttpException('手机号码已被注册', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    await user.setPassword(user.password);
    user.nickname = user.phone;
    user.email = user.phone + '@ggt158.com';
    user.picture = 'http://dev-ggt-public.oss-cn-shenzhen.aliyuncs.com/userheader31537876068';
    return await this.repository.save(user);;
  }

  async logout(token) {
    let toRemove = await this.tokenRepo.findOne(token);
    let result = await this.tokenRepo.remove(toRemove);
    return result;
  }
  
  async batchList(uids) {
    let list = [];
    for (let i = 0; i < uids.length; i++) {
      list.push(await this.repository.findOne({
        select: ['id', 'phone', 'nickname', 'picture'],
        where: { id: uids[i] }
      }));
    }
    return list;
  }

  async changePassword(user, data) {
    let toVerify = await this.repository.findOne({
      select: ['id', 'password'],
      where: { id: user.id }
    });

    let verify = await toVerify.verifyPassword(data.oldPassword);
    if (!verify) {
      throw new HttpException('原密码错误', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    let toUpdate = await this.repository.findOne(user.id);
    await toUpdate.setPassword(data.newPassword);
    let result = await this.repository.save(toUpdate);
    return result;
  }

  async resetPassword(user, data) {
    let toUpdate = await this.repository.findOne(user.id);
    await toUpdate.setPassword(data.newPassword);
    let result = await this.repository.save(toUpdate);
    return result;
  }

}
