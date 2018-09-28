import {Entity, PrimaryGeneratedColumn, Column, OneToMany} from 'typeorm';
import {Topic} from './topic';

@Entity()
export class Category {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @OneToMany(type => Topic, topic => topic.category)
  topics: Topic[]

  /**
   * 父类
   */
  @Column({ nullable: true })
  parentCid: number;

  @Column({ nullable: true })
  disabled: number;

  /**
   * 排序字段
   */
  @Column({ nullable: true })
  order: number;
}
