import {Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne, ManyToMany, JoinTable} from 'typeorm';
import {Category} from './category';
import {Tag} from './tag';

@Entity()
export class Topic {
  
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  content: string;

  @ManyToOne(type => Category, category => category.topics, { eager: true })
  @JoinColumn({ name: 'cid'})
  category: Category;

  @ManyToMany(type => Tag, tag => tag.topics, { eager: true })
  @JoinTable()
  tags: Tag[];

  @Column({ nullable: true })
  uid: number;

  @Column({ nullable: true })
  viewCount: number;

  @Column({ nullable: true })
  likeCount: number;

  @Column({ nullable: true })
  followCount: number;

  @Column({ nullable: true })
  deleted: number;

  @Column({ nullable: true })
  createAt: string;

  @Column({ nullable: true })
  updateAt: string;
}
