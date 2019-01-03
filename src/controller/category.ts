import { Controller, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BaseController } from '../base/controller';
import { CategoryService } from '../service/category';

@Controller('category')
@UseGuards(AuthGuard('bearer'))
export class CategoryController extends BaseController {
  constructor(protected readonly service: CategoryService) {
    super(service);
  }
}
