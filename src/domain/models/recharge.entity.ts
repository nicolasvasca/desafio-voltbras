import { Field, ID, ObjectType } from '@nestjs/graphql';
import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Station } from './station.entity';

@ObjectType()
@Entity()
export class Recharge {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @ManyToOne(() => User, { onUpdate: 'CASCADE' })
  @JoinColumn()
  user: User;

  @ManyToOne(() => Station, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn()
  station: Station;

  @CreateDateColumn({ name: 'started' })
  started: Date;

  @CreateDateColumn({ name: 'finished' })
  finished: Date;
}
