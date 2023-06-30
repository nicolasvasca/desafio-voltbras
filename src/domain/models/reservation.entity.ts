import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Recharge } from './recharge.entity';
import { Station } from './station.entity';
import { User } from './user.entity';
import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@ObjectType()
@Entity()
export class Reservation {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @ManyToOne(() => User, { onUpdate: 'CASCADE' })
  @JoinColumn()
  user: User;

  @ManyToOne(() => Station, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn()
  station: Station;

  @OneToOne(() => Recharge, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn()
  recharge?: Recharge;

  @CreateDateColumn({ name: 'started' })
  started: Date;

  @CreateDateColumn({ name: 'finished' })
  finished: Date;
}
