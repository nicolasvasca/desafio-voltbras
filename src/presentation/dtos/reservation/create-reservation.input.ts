import { InputType } from '@nestjs/graphql';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateReservationInput {
  @IsString()
  @IsNotEmpty({ message: 'Invalid characters' })
  userId: string;

  @IsString()
  @IsNotEmpty({ message: 'Invalid characters' })
  stationId: string;

  @IsDate()
  @IsNotEmpty({ message: 'Invalid characters' })
  start: Date;
}
