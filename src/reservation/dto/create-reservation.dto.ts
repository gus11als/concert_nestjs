// src/reservation/dto/create-reservation.dto.ts
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateReservationDto {
  @IsNotEmpty()
  @IsNumber()
  show_id: number;

  @IsNotEmpty()
  @IsNumber()
  show_time_id: number;
}
