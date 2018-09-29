import { UseInterceptors } from '@nestjs/common';
import { BaseInterceptor } from './interceptor';

/**
 * 纯静 Controller 基类
 */
@UseInterceptors(BaseInterceptor)
export class PureController {
  constructor(protected readonly service) {}
}
