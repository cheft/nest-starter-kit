import {Entity, PrimaryGeneratedColumn, Column} from 'typeorm';
import {IsMobilePhone, IsEmail} from "class-validator";

@Entity()
export class User {
  
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  username: string;

  @Column({ select: false })
  password: string;

  @Column()
  phone: string;

  @Column()
  @IsEmail({}, { message: '邮箱格式不正确' })
  email: string;

  @Column({ nullable: true })
  picture: string;

  @Column({ default: 1 })
  status: number;

  @Column({ default: () => "NOW()" })
  createAt: Date;

  @Column({ default: () => "NOW()" })
  updateAt: Date;
}
