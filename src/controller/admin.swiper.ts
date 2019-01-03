import { Controller, Post, Body,
  UseInterceptors, FileInterceptor, UploadedFile } from '@nestjs/common';
import { BaseController } from '../base/controller';
import { AdminSwiperService } from '../service/admin.swiper';
import upload from '../util/upload';

@Controller('admin/swiper')
export class AdminSwiperController extends BaseController {
  constructor(protected readonly service: AdminSwiperService) {
    super(service);
  }

  /**
   * 轮播管理上传图片
   * @param data
   */
  @Post('upload')
  @UseInterceptors(FileInterceptor('image'))
  uploadFile(@UploadedFile() image) {
    return upload(image.originalname, image.buffer);
  }

  /**
   * 添加一条数据
   * @param data
   */
  @Post('insetdata')
  insetData(@Body() data) {
    return this.service.insetdata(data);
  }

  /**
   * 获取全部的轮播数据
   * @param data
   */
  @Post('swiper')
  getDatas(@Body() data) {
    return this.service.swiper(data);
  }

  /**
   * 更换顺序
   * @param data
   */
  @Post('update')
  updateDatas(@Body() data) {
    return this.service.update(data);
  }

  /**
   * 删除一行
   * @param data
   */
  @Post('delete')
  deleterow(@Body() data) {
    return this.service.delete(data);
  }
}
