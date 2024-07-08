// Nest.js의 Module 데코레이터를 import
import { Module } from '@nestjs/common';
// TypeORM 모듈을 import
import { TypeOrmModule } from '@nestjs/typeorm';
// ReservationService를 import
import { ReservationService } from './reservation.service';
// ReservationController를 import
import { ReservationController } from './reservation.controller';
// Reservation 엔티티를 import
import { Reservation } from './entities/reservation.entity';
// Show 엔티티를 import
import { Show } from 'src/show/entities/show.entity';
// Showtime 엔티티를 import
import { Showtime } from 'src/showtime/entities/showtime.entity';
// User 엔티티를 import
import { User } from 'src/user/entities/user.entity';

// ReservationModule을 정의.
@Module({
  // TypeOrmModule.forFeature를 사용하여 Reservation, Show, Showtime, User 엔티티를 TypeORM 모듈에 등록
  imports: [TypeOrmModule.forFeature([Reservation, Show, Showtime, User])],
  // ReservationService를 이 모듈의 프로바이더로 등록
  providers: [ReservationService],
  // ReservationController를 이 모듈의 컨트롤러로 등록
  controllers: [ReservationController],
})
export class ReservationModule {}
