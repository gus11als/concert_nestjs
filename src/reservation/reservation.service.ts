// Nest.js의 Injectable 데코레이터와 예외 클래스들을 import
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
// TypeORM의 InjectRepository 데코레이터와 관련된 클래스들을 import
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
// Reservation, Show, Showtime, User 엔티티를 import
import { Reservation } from './entities/reservation.entity';
import { Show } from 'src/show/entities/show.entity';
import { Showtime } from 'src/showtime/entities/showtime.entity';
import { User } from 'src/user/entities/user.entity';
// CreateReservationDto를 import
import { CreateReservationDto } from './dto/create-reservation.dto';

// ReservationService 클래스를 Injectable 데코레이터로 주입 가능하게 만듬
@Injectable()
export class ReservationService {
  // 생성자에서 Reservation 엔티티의 리포지토리와 EntityManager를 주입
  constructor(
    @InjectRepository(Reservation)
    private reservationsRepository: Repository<Reservation>,
    private entityManager: EntityManager,
  ) {}

  // 예약을 생성하는 메서드
  async createReservation(
    userId: number, // 사용자의 ID
    createReservationDto: CreateReservationDto, // 예약 생성 DTO
  ): Promise<Reservation> {
    // DTO에서 공연 ID와 공연 시간 ID를 추출
    const { show_id, show_time_id } = createReservationDto;

    // 트랜잭션을 사용하여 예약을 생성
    return this.entityManager.transaction(async (manager) => {
      // User 엔티티를 조회
      const user = await manager.findOne(User, { where: { id: userId } });
      // Show 엔티티를 조회
      const show = await manager.findOne(Show, { where: { id: show_id } });
      // Showtime 엔티티를 조회
      const showtime = await manager.findOne(Showtime, {
        where: { id: show_time_id, show: { id: show_id } },
      });

      // 유저가 존재하지 않을시
      if (!user) {
        throw new NotFoundException('해당 유저가 존재하지 않습니다.');
      }

      // 공연이 존재하지 않을시
      if (!show) {
        throw new NotFoundException('공연이 존재하지 않습니다.');
      }

      // 공연 시간이 존재하지 않을시
      if (!showtime) {
        throw new NotFoundException('공연 시간이 존재하지 않습니다.');
      }

      // 예약 가능한 좌석이 없을시
      if (showtime.available_seats <= 0) {
        throw new BadRequestException('예약이 가능한 좌석이 없습니다.');
      }

      // 유저의 포인트가 부족할시
      if (user.points < show.price) {
        throw new BadRequestException('예약에 필요한 포인트가 부족합니다.');
      }

      // 이미 예약이 존재하는지 확인
      const existingReservation = await this.reservationsRepository.findOne({
        where: {
          user: { id: userId },
          show: { id: show_id },
          showtime: { id: show_time_id },
        },
      });

      // 이미 예약이 존재할 시
      if (existingReservation) {
        throw new ConflictException('이미 해당 공연을 예약했습니다.');
      }

      // 유저의 포인트를 차감
      user.points -= show.price;
      // 사용 가능한 좌석 수를 줄임
      showtime.available_seats -= 1;

      // 변경된 유저와 쇼타임을 저장
      await manager.save(user);
      await manager.save(showtime);

      // 새로운 예약을 생성
      const reservation = this.reservationsRepository.create({
        user,
        show,
        showtime,
      });

      // 예약을 저장
      await manager.save(reservation);

      return reservation;
    });
  }

  // 유저의 예약을 조회하는 메서드
  async findReservationsByUser(userId: number): Promise<Reservation[]> {
    // 특정 유저의 예약들을 조회
    const reservations = await this.reservationsRepository.find({
      where: { user: { id: userId } },
      relations: ['show', 'showtime'],
      order: { created_at: 'DESC' },
    });

    // 예약이 존재하지 않을시
    if (!reservations || reservations.length === 0) {
      throw new NotFoundException('예약된 공연이 없습니다.');
    }

    return reservations;
  }

  // 모든 예약을 조회하는 메서드
  async findAllReservations(): Promise<Reservation[]> {
    // 모든 예약들을 조회
    const reservations = await this.reservationsRepository.find({
      relations: ['show', 'showtime', 'user'],
      order: { created_at: 'DESC' },
    });

    // 예약이 존재하지 않을 시
    if (!reservations || reservations.length === 0) {
      throw new NotFoundException('No reservations found.');
    }

    return reservations;
  }
}
