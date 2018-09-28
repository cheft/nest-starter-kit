import {Entity, PrimaryGeneratedColumn, Column} from 'typeorm';

@Entity()
export class Category {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    nullable: true
  })
  description: string;

  /**
   * 父类
   */
  @Column({
    nullable: true
  })
  parentCid: number;

  @Column({
    nullable: true
  })
  disabled: number;

  /**
   * 排序字段
   */
  @Column({
    nullable: true
  })
  order: number;
}
