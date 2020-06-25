import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  OneToMany,
  CreateDateColumn,
  OneToOne,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Task } from '../tasks/task.entity';

@Entity('users')
@Unique(['email'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  salt: string;

  @OneToMany(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    type => Task,
    task => task.user,
    { eager: true },
  )
  tasks: Task[];

  async validatePassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt);
    return hash === this.password;
  }

  // @OneToOne(
  //   // eslint-disable-next-line @typescript-eslint/no-unused-vars
  //   type => Task,
  //   task => task.user,
  //   { eager: true },
  // )
  // token: Task[];

  @CreateDateColumn()
  created_at: Date;

  @CreateDateColumn()
  updated_at: Date;
}
