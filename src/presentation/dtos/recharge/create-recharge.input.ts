import { InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateRechargeInput {
  @IsString()
  @IsNotEmpty({ message: 'Invalid characters' })
  userId: string;

  @IsString()
  @IsNotEmpty({ message: 'Invalid characters' })
  stationId: string;
}
