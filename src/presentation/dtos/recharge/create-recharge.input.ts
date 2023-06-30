import { InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

@InputType()
export class CreateRechargeInput {
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'Invalid characters' })
  userId?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'Invalid characters' })
  stationId?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'Invalid characters' })
  reservationId?: string;
}
