import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '../base/service';
import { User } from '../entity/user';
import { Token } from '../entity/token';
import { Follow } from '../entity/follow';

@Injectable()
export class UserService extends BaseService {
  constructor(
    @InjectRepository(User) protected readonly repository: Repository<User>,
    @InjectRepository(Token) protected readonly tokenRepo: Repository<Token>,
    @InjectRepository(Follow) protected readonly followRepo: Repository<Follow>,
  ) {
    super(repository);
  }

  async login(data) {
    const user = await this.repository.findOne({
      select: ['id', 'password', 'status'],
      where: { phone: data.phone },
    });

    if (!user) {
      throw new HttpException('用户不存在', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    if (user.status === 0) {
      throw new HttpException('该用户被禁用', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    const verify = user.verifyPassword(data.password);
    if (!verify) {
      throw new HttpException('密码错误', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    const token = new Token();
    token.user = user;
    const result = await this.tokenRepo.save(token);
    delete result.user.password;
    return result;
  }

  async register(user) {
    const result = await this.repository.findOne({
      select: ['id'],
      where: { phone: user.phone },
    });
    if (result) {
      throw new HttpException('手机号码已被注册', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    await user.setPassword(user.password);
    user.nickname = user.phone;
    user.picture = 'http://prod-ggt-public.oss-cn-shenzhen.aliyuncs.com/' +
      'images/07de12a6-465f-451c-8246-94d8863a118c.png';
    const saveUser = await this.repository.save(user);

    const token = new Token();
    token.user = saveUser;
    return await this.tokenRepo.save(token);
  }

  async logout(token) {
    const toRemove = await this.tokenRepo.findOne(token);
    const result = await this.tokenRepo.remove(toRemove);
    return result;
  }

  async batchList(uids) {
    const list = [];
    for (let i = 0; i < uids.length; i++) {
      list.push(await this.repository.findOne({
        select: ['id', 'phone', 'nickname', 'picture'],
        where: { id: uids[i] },
      }));
    }
    return list;
  }

  async changePassword(user, data) {
    const toVerify = await this.repository.findOne({
      select: ['id', 'password'],
      where: { id: user.id },
    });

    const verify = toVerify.verifyPassword(data.oldPassword);
    if (!verify) {
      throw new HttpException('原密码错误', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    const toUpdate = await this.repository.findOne(user.id);
    await toUpdate.setPassword(data.newPassword);
    const result = await this.repository.save(toUpdate);
    return result;
  }

  async resetPassword(data) {
    const toUpdate = await this.repository.findOne({
      where: {
        phone: data.phone,
      },
    });
    await toUpdate.setPassword(data.newPassword);
    const result = await this.repository.save(toUpdate);
    return result;
  }

  async toggleFollow(user, id) {
    const follow = await this.followRepo.findOne({
      select: ['id'],
      where: { user, followId: id, type: 'user_follow' },
    });

    if (follow) {
      return await this.followRepo.remove(follow);
    }

    return await this.followRepo.save({ user, followId: id, type: 'user_follow' });
  }

  async getFans(id, query) {
    const page = parseInt(query._page || 1, 10);
    const pageSize = parseInt(query._pageSize || 10, 10);

    const result = await this.followRepo.findAndCount({
      where: { followId: id, type: 'user_follow' },
      take: pageSize,
      skip: (page - 1) * pageSize,
      order: {
        createAt: 'DESC',
      },
    });

    const fans = result[0].map((f) => {
      return f.user;
    });

    // 判断登录用户对每个粉丝的关注状态
    if (query.loginuser) {
      const loginuser = new User();
      loginuser.id = parseInt(query.loginuser, 10);
      for (let i = 0; i < fans.length; i++) {
        const user = fans[i];
        const count = await this.followRepo.count({
          where: { user: loginuser, followId: user.id, type: 'user_follow' },
        });
        Object.assign(user, { isFollow: count > 0 ? true : false });
      }
    }

    return {
      list: fans,
      count: result[1],
      page,
      pageSize,
    };
  }

  async getFollow(id, query) {
    const page = parseInt(query._page || 1, 10);
    const pageSize = parseInt(query._pageSize || 10, 10);

    const user = new User();
    user.id = id;

    const result = await this.followRepo.findAndCount({
      select: ['id', 'followId', 'createAt'],
      where: { user, type: 'user_follow' },
      take: pageSize,
      skip: (page - 1) * pageSize,
      order: {
        createAt: 'DESC',
      },
    });

    // 级联获取用户数据
    const follows = result[0];
    const list = [];
    for (let i = 0; i < follows.length; i++) {
      list.push(await this.repository.findOne({
        where: { id: follows[i].followId },
      }));
    }

    return {
      list,
      count: result[1],
      page,
      pageSize,
    };
  }

  // 获取用户及关注相关信息
  async getMoreInfo(id, loginUserId) {
    const user = await this.repository.findOne(id);
    const followCount = await this.followRepo.count({
      select: ['id'],
      where: { type: 'user_follow', user },
    });
    const fansCount = await this.followRepo.count({
      select: ['id'],
      where: { type: 'user_follow', followId: user.id },
    });
    let followYou = false;
    let followMe = false;
    if (loginUserId) {
      const loginUser = new User();
      loginUser.id = loginUserId;
      let count = await this.followRepo.count({
        where: { type: 'user_follow', followId: user.id, user: loginUser },
      });
      followYou = count > 0 ? true : false;
      count = await this.followRepo.count({
        where: { type: 'user_follow', followId: loginUserId, user },
      });
      followMe = count > 0 ? true : false;
    }
    Object.assign(user, {
      followCount,
      fansCount,
      followYou,
      followMe,
    });
    return user;
  }

  async phone(data) {
    const result = await this.repository.findOne({
      where: {
        phone: data.phone,
      },
    });
    return result;
  }

  async findVisit(req, data) {
    const userId = req.user.id;
    const result = await this.repository.findOne({
      select: ['lastVisitTime'],
      where: {
        id: userId,
      },
    });
    return result;
  }

  async updateVisit(req, data) {
    const userId = req.user.id;
    const result = await this.repository.update({
      id: userId,
    },                                          {
      lastVisitTime: new Date(),
    });
    return result;
  }

  async userUpdate(id, data) {
    const save = async () => {
      const toUpdate = await this.repository.findOne(id);
      Object.assign(toUpdate, data);

      const result = await this.repository.save(toUpdate);
      return result;
    };
    if (data.nickname) {
      const nick = await this.repository.findOne({
        where: {
          nickname: data.nickname,
        },
      });
      if (nick && nick.id !== id) {
        throw new HttpException('用户昵称已经被使用', HttpStatus.INTERNAL_SERVER_ERROR);
      } else return save();
    } else return save();
  }
}
