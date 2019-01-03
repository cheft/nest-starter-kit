import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Swiper {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string;

  @Column()
  picture: string;

  @Column()
  content: string;

  @Column()
  order: number;

  @Column()
  swiperPosition: string;
}
