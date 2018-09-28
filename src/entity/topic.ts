import {Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne, ManyToMany, JoinTable} from 'typeorm';
import {Category} from './category';
import {Tag} from './tag';
import {User} from './user';

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

  @ManyToOne(type => User, { eager: true })
  @JoinColumn({ name: 'uid'})
  user: User;

  @Column({ default: 0 })
  viewCount: number;

  @Column({ default: 0 })
  likeCount: number;

  @Column({ default: 0 })
  followCount: number;

  @Column({ default: 0 })
  deleted: number;

  @Column({ default: () => "NOW()" })
  createAt: Date;

  @Column({ default: () => "NOW()" })
  updateAt: Date;
}
