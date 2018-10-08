import {Entity, PrimaryGeneratedColumn, Column} from 'typeorm';
import {IsMobilePhone, IsEmail} from "class-validator";
import * as hashers from 'node-django-hashers';

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

  @Column()
  // @IsEmail({}, { message: '邮箱格式不正确' })
  email: string;

  @Column({ nullable: true })
  picture: string;

  @Column({ default: 1 })
  status: number;

  @Column({ default: () => "NOW()" })
  createAt: Date;

  @Column({ default: () => "NOW()" })
  updateAt: Date;

  async makePassword(password: string) {
    var h = new hashers.PBKDF2PasswordHasher();
    var hash = await h.encode(password, h.salt()).then();
    return hash;
  }

  async verifyPassword(password: string) {
    var h = new hashers.PBKDF2PasswordHasher();
    return await h.verify(password, this.password);
  }

  async setPassword(password: string) {
    if (password) {
      this.password = await this.makePassword(password);
    } else {
      this.password = undefined;
    }
  }
}
