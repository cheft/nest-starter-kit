import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '../base/service';
import { Swiper } from '../entity/swiper';

@Injectable()
export class AdminSwiperService extends BaseService {
  constructor(@InjectRepository(Swiper) protected readonly repository: Repository<Swiper>) {
    super(repository);
  }

  async insetdata(data) {
    const count = await this.repository.find(
      {
        where:{
          swiperPosition: data.swiperPosition,
        },
      },
    );
    data.order = count.length;
    const result = await this.repository.save(data);
    return result;
  }

  async swiper(data) {
    const result = await this.repository.find(
      {
        where:{
          swiperPosition: data.swiperPosition,
        },
      },
    );
    return result;
  }

  async update(req) {
    try {
      req.forEach(async (element) => {
        await this.repository.update({
          id: element.id,
        },                           {
          order: element.order,
        });
      });
      return 'update ok';
    } catch (err) {
      return 'update err';
    }
  }

  async delete(req) {
    try {
      await this.repository.delete({
        id: req.id,
      });
      const result = await this.repository.find();
      result.forEach(async (e) => {
        if (e.order > req.order) {
          await this.repository.update({
            id: e.id,
          },                           {
            order: e.order - 1,
          });
        }
      });
      return 'delete ok';
    } catch (err) {
      return 'delete err';
    }
  }
}
