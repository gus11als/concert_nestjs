// Nest.js의 Controller, Post, Get, Body, Req 데코레이터를 import
import { Controller, Post, Get, Body, Req } from '@nestjs/common';
// ReservationService를 import
import { ReservationService } from './reservation.service';
// Express의 Request 객체를 import
import { Request } from 'express';
// CreateReservationDto를 import
import { CreateReservationDto } from './dto/create-reservation.dto';

// 'show/reservation' 경로를 가진 컨트롤러를 정의
@Controller('show/reservation')
export class ReservationController {
  // ReservationService를 주입받는 생성자
  constructor(private readonly reservationService: ReservationService) {}

  // 'show/reservation' 경로로 들어오는 POST 요청을 처리하여 새로운 예약을 생성
  @Post()
  async create(
    @Body() createReservationDto: CreateReservationDto, // 요청 본문에서 CreateReservationDto를 받는부분
    @Req() req: Request, // 요청 객체를 받음
  ) {
    // 요청한 사용자의 ID를 가져옴
    const userId = req['user'].id;

    // ReservationService의 createReservation 메서드를 호출하여 새로운 예약을 생성
    const reservation = await this.reservationService.createReservation(
      userId,
      createReservationDto,
    );

    // 생성된 예약 정보를 응답으로 반환
    return {
      message: '예약에 성공하셨습니다.',
      reservation: {
        id: reservation.id,
        show_id: reservation.show.id,
        show_time_id: reservation.showtime.id,
        name: reservation.show.name,
        location: reservation.show.location,
        date: reservation.showtime.date,
        start_time: reservation.showtime.start_time,
        end_time: reservation.showtime.end_time,
        price: reservation.show.price,
        created_at: reservation.created_at,
        updated_at: reservation.updated_at,
      },
    };
  }

  // 'show/reservation/user' 경로로 들어오는 GET 요청을 처리하여 사용자의 예약을 조회
  @Get('user')
  async getUserReservations(@Req() req: Request) {
    // 요청한 사용자의 ID를 가져옵니다.
    const userId = req['user'].id;

    // ReservationService의 findReservationsByUser 메서드를 호출하여 사용자의 예약을 조회
    const reservations =
      await this.reservationService.findReservationsByUser(userId);

    // 조회된 예약 정보를 응답으로 반환
    return {
      reservations: reservations.map((reservation) => ({
        reservation_id: reservation.id,
        show_id: reservation.show.id,
        show_time_id: reservation.showtime.id,
        name: reservation.show.name,
        location: reservation.show.location,
        date: reservation.showtime.date,
        start_time: reservation.showtime.start_time,
        end_time: reservation.showtime.end_time,
        price: reservation.show.price,
        created_at: reservation.created_at,
      })),
    };
  }

  // 'show/reservation/all' 경로로 들어오는 GET 요청을 처리하여 모든 예약을 조회
  @Get('all')
  async getAllReservations() {
    // ReservationService의 findAllReservations 메서드를 호출하여 모든 예약을 조회
    const reservations = await this.reservationService.findAllReservations();

    // 조회된 모든 예약 정보를 응답으로 반환
    return {
      reservations: reservations.map((reservation) => ({
        reservation_id: reservation.id,
        user_id: reservation.user.id,
        user_name: reservation.user.username,
        show_id: reservation.show.id,
        show_time_id: reservation.showtime.id,
        name: reservation.show.name,
        location: reservation.show.location,
        date: reservation.showtime.date,
        start_time: reservation.showtime.start_time,
        end_time: reservation.showtime.end_time,
        price: reservation.show.price,
        created_at: reservation.created_at,
      })),
    };
  }
}
