import { Injectable, NestInterceptor, ExecutionContext, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * 请求拦截器
 * 1.可转换数据, 2.可记录成功日志
 */
@Injectable()
export class BaseInterceptor extends Logger implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    call$: Observable<any>,
  ): Observable<any> {
    return call$.pipe(map((data) => {
      return { data, statusCode: 200, message: 'Success' };
    }));
  }
}
