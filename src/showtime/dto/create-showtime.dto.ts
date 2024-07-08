import { IsNotEmpty, IsString } from 'class-validator';

export class CreateShowtimeDto {
  @IsNotEmpty()
  @IsString()
  date: string;

  @IsNotEmpty()
  @IsString()
  start_time: string;

  @IsNotEmpty()
  @IsString()
  end_time: string;
}
