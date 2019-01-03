import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Topic } from './topic';

@Entity()
export class Tag {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany(type => Topic, topic => topic.tags)
  topics: Topic[];

  @Column({ nullable: true })
  description: string;

  @Column({ default: 1 })
  status: number;

  // 关联父级标签 id
  @Column({ nullable: true })
  pid: number;

  // 分类级别 1 为 一级标签 2为 二级标签
  @Column({ nullable: true })
  level: number;
  /**
   * 排序字段
   */
  @Column({ nullable: true })
  sort: number;
}
