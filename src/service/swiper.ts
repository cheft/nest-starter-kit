import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '../base/service';
import { Swiper } from '../entity/swiper';

@Injectable()
export class SwiperService extends BaseService {
  constructor(@InjectRepository(Swiper) protected readonly repository: Repository<Swiper>) {
    super(repository);
  }

  async getSwiper(data) {
    const result = await this.repository.find(
      {
        where:{
          swiperPosition: data.swiperPosition,
        },
      },
    );
    return result;
  }
}
