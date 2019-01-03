import { Controller, Post, Body } from '@nestjs/common';
import { BaseController } from '../base/controller';
import { SwiperService } from '../service/swiper';

@Controller('swiper')
export class SwiperController extends BaseController {
  constructor(protected readonly service: SwiperService) {
    super(service);
  }
  /**
   * 获取轮播的全部数据
   * @param data
   */
  @Post('getSwiper')
  getSwiper(@Body() data) {
    return this.service.getSwiper(data);
  }
}
