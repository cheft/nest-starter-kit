import {Entity, PrimaryGeneratedColumn, Column} from 'typeorm';

@Entity()
export class Topic {
  
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  content: string;

  @Column()
  cid: number;

  @Column()
  uid: number;

  @Column()
  viewCount: number;

  @Column()
  likeCount: number;

  @Column()
  followCount: number;

  @Column()
  deleted: number;

  @Column()
  createAt: string;

  @Column()
  updateAt: string;
}
