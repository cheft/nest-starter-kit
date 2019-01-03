import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne } from 'typeorm';
import { User } from './user';

@Entity()
export class Token {

  // @ts-ignore
  @PrimaryGeneratedColumn('uuid', { length: 36 })
  token: string;

  @ManyToOne(type => User, { eager: true })
  @JoinColumn({ name: 'uid' })
  user: User;

  @Column({ default: () => 'NOW()' })
  createAt: Date;

  @Column({ default: () => 'NOW()' })
  updateAt: Date;
}
