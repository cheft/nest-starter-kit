import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import * as crypto from 'crypto';

import { Follow } from './follow';

@Entity()
export class User {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nickname: string;

  @Column({ nullable: true })
  aboutme: string;

  @Column({ nullable: true })
  sex: number;

  @Column({ select: false })
  password: string;

  @Column()
  // @IsMobilePhone('', { message: '手机格式不正确' })
  phone: string;

  @Column({ nullable: true })
  // @IsEmail({}, { message: '邮箱格式不正确' })
  email: string;

  @Column({ nullable: true })
  picture: string;

  @OneToMany(type => Follow, follow => follow.user)
  follows: Follow[];

  @Column({ default: 1 })
  status: number;

  @Column({ default: 0 })
  isAdmin: number;

  @Column({ default: 0 })
  vip: number;

  @Column({ default: () => 'NOW()' })
  lastVisitTime: Date;

  @Column({ default: () => 'NOW()' })
  createAt: Date;

  @Column({ default: () => 'NOW()' })
  updateAt: Date;

  verifyPassword(password: string) {
    const h = crypto.createHmac('sha256', password).digest('hex');
    return this.password === h;
  }

  setPassword(password: string) {
    if (password) {
      this.password = crypto.createHmac('sha256', password).digest('hex');
    } else {
      this.password = undefined;
    }
  }
}
