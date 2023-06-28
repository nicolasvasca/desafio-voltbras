import { InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateStationInput {
  @IsString()
  @IsNotEmpty({ message: 'Invalid characters' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Invalid characters' })
  planetName: string;
}
