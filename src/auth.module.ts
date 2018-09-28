import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './service/auth';
import { User } from './entity/user';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [AuthService],
})
export class AuthModule {}
