import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './service/auth';
import { Token } from './entity/token';

@Module({
  imports: [TypeOrmModule.forFeature([Token])],
  providers: [AuthService],
})
export class AuthModule {}
