import {Entity, PrimaryGeneratedColumn, Column} from 'typeorm';

@Entity()
export class User {
  
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  phone: string;

  @Column()
  email: string;

  @Column()
  picture: string;

  @Column()
  status: string;

  @Column()
  createAt: string;

  @Column()
  updateAt: string;
}
