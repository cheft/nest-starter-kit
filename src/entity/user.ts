import {Entity, PrimaryGeneratedColumn, Column} from 'typeorm';

@Entity()
export class User {
  
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  username: string;

  @Column({ select: false })
  password: string;

  @Column()
  phone: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  picture: string;

  @Column({ default: 1 })
  status: number;

  @Column({ default: () => "NOW()" })
  createAt: Date;

  @Column({ default: () => "NOW()" })
  updateAt: Date;
}
