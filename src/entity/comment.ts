import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user';
import { Topic } from './topic';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => Topic, { eager: true })
  @JoinColumn({ name:'topicId' })
  topic: Topic;

  @ManyToOne(type => User, { eager: true })
  @JoinColumn({ name:'userId' })
  user: User;

  @Column('text')
  content: string;

  @Column({ default: 0 })
  isReply: number;

  @Column({ default: 0 })
  status: number;

  @Column({ default: 0 })
  replyId: number;

  @Column({ default: 0 })
  replyUserId: number;

  @Column({ default: 0 })
  like: number;

  @Column({ default: () => 'NOW()' })
  createAt: Date;
}
