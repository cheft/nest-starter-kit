import { Entity, PrimaryGeneratedColumn, Column,
  JoinColumn, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { Category } from './category';
import { Tag } from './tag';
import { User } from './user';

@Entity()
export class Topic {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  content: string;

  @ManyToOne(type => Category, category => category.topics, { eager: true })
  @JoinColumn({ name: 'cid' })
  category: Category;

  @ManyToMany(type => Tag, tag => tag.topics, { eager: true })
  @JoinTable({ name: 'topic_tag' })
  tags: Tag[];

  @ManyToOne(type => User, { eager: true })
  @JoinColumn({ name: 'uid' })
  user: User;

  /**
   * 真实访问量
   */
  @Column({ default: 0 })
  viewCount: number;

  /**
   * 显示访问量
   */
  @Column({ default: 0 })
  visitCount: number;

  /**
   * 0-待审核，1-已发布, -1-审核不通过 2-已删除
   */
  @Column({ default: 0 })
  status: number;

  @Column({ nullable: true })
  auditAt: Date;

  /**
   * 用于标识关联的数据类型，比如视频的 Id
   */
  @Column({ nullable: true })
  refType: string;

  /**
   * 用于关联其它数据，比如视频的 Id
   */
  @Column({ nullable: true })
  refValue: string;

  @Column({ default: () => 'NOW()' })
  createAt: Date;

  @Column({ default: () => 'NOW()' })
  ptime: Date;

  @Column({ default: () => 'NOW()' })
  updateAt: Date;
}
