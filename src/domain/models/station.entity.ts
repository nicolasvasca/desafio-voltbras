import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Planet } from './planet.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@ObjectType()
@Entity()
export class Station {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => Planet, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn()
  planet: Planet;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;
}
