import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user';

@Entity('user_follows')
export class Follow {

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => User, user => user.follows, { eager: true })
  @JoinColumn({ name: 'uid' })
  user: User;

  /**
   * 区分不同类型的关注、点赞、喜欢、收藏等；
   * 用户关注-user_follow, 文章关注收藏-topic_follow, 文章点赞-topic_like,
   * 视频关注收藏-video_follow, 视频点赞-video_like
   */
  @Column()
  type: string;

  /**
   * 可能是user.id，可能是 topic.id，根据 type 而定
   */
  @Column()
  followId: number;

  @Column({ default: () => 'NOW()' })
  createAt: Date;
}
