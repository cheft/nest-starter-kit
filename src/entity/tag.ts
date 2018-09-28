import {Entity, PrimaryGeneratedColumn, Column, ManyToMany} from 'typeorm';
import {Topic} from './topic';

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

  @Column({ nullable: true })
  disabled: number;
}
