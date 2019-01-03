import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '../base/service';
import { User } from '../entity/user';

@Injectable()
export class AdminUserService extends BaseService {
  constructor(@InjectRepository(User) protected readonly repository: Repository<User>) {
    super(repository);
  }

  async login(data) {
    let user = await this.repository.findOne({
      select: ['id', 'password', 'isAdmin', 'status'],
      where: { phone: data.phone },
    });

    if (!user) {
      throw new HttpException('用户不存在', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    if (user.status === 0) {
      throw new HttpException('该用户被禁用', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    if (user.isAdmin === 0) {
      throw new HttpException('普通用户不允许登录', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    const verify = user.verifyPassword(data.password);
    if (!verify) {
      throw new HttpException('密码错误', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    user = await this.repository.findOne(user.id);
    return user;
  }

  async create(user) {
    if (!user.phone) throw new HttpException('手机号码必须填写', HttpStatus.INTERNAL_SERVER_ERROR);
    if (!user.password) throw new HttpException('密码必须填写', HttpStatus.INTERNAL_SERVER_ERROR);

    const result = await this.repository.findOne({
      select: ['id'],
      where: { phone: user.phone },
    });
    if (result) {
      throw new HttpException('手机号码已被使用', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    await user.setPassword(user.password);
    user.nickname = user.nickname || user.phone;
    user.picture = user.picture || 'http://prod-ggt-public.oss-cn-shenzhen.aliyuncs.com/' +
     'images/07de12a6-465f-451c-8246-94d8863a118c.png';
    const saveUser = await this.repository.save(user);
    return saveUser;
  }

  /**
   * 根据条件查询列表
   * @param query 查询条件
   */
  async search(query) {
    const page = parseInt(query._page || 1, 10);
    const pageSize = parseInt(query._pageSize || 10, 10);
    let orderField = 'createAt';
    let orderRule = 'DESC';
    if (query._order) {
      const tmp = query._order.split('_');
      orderField = tmp[0];
      orderRule = tmp[1];
    }

    let queryBuilder = this.repository.createQueryBuilder('user');
    if (query.status) {
      queryBuilder = queryBuilder.where('status = :status', { status: query.status });
    }
    if (query.isAdmin) {
      queryBuilder = queryBuilder.andWhere('isAdmin = :isAdmin', { isAdmin: query.isAdmin });
    }
    if (query.keyword) {
      queryBuilder = queryBuilder.andWhere('phone like :keyword or nickname like :keyword',
                                           { keyword: `%${query.keyword}%` });
    }
    const count = await queryBuilder.getCount();
    const list = await queryBuilder.orderBy(orderField, orderRule === 'DESC' ? 'DESC' : 'ASC')
      .skip((page - 1) * pageSize).take(pageSize).getMany();

    return {
      list,
      count,
      page,
      pageSize,
    };
  }

  async update(id, user) {

    const save = async () => {
      const toUpdate = await this.repository.findOne(id);
      if (!toUpdate) {
        throw new HttpException('该用户不存在', HttpStatus.INTERNAL_SERVER_ERROR);
      }
      Object.assign(toUpdate, user);
      if (user.password) {
        await toUpdate.setPassword(user.password);
      }
      const saveUser = await this.repository.save(toUpdate);
      return saveUser;
    };

    if (user.nickname) {
      const nick = await this.repository.findOne({
        where: {
          nickname: user.nickname,
        },
      });
      if (nick && nick.id !== parseInt(id, 10)) {
        throw new HttpException('用户昵称已经被使用', HttpStatus.INTERNAL_SERVER_ERROR);
      } else return save();
    } else return save();
  }
}
