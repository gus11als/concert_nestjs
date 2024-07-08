// Nest.js의 Injectable 데코레이터를 import
import { Injectable } from '@nestjs/common';
// TypeORM의 InjectRepository 데코레이터를 import
import { InjectRepository } from '@nestjs/typeorm';
// TypeORM의 Repository 클래스를 import
import { Repository } from 'typeorm';
// Showtime 엔티티를 import
import { Showtime } from './entities/showtime.entity';
// CreateShowtimeDto를 import
import { CreateShowtimeDto } from './dto/create-showtime.dto';
// Show 엔티티를 import
import { Show } from 'src/show/entities/show.entity';

// ShowtimeService 클래스를 Injectable 데코레이터로 주입
@Injectable()
export class ShowtimeService {
  // 생성자에서 Showtime 엔티티의 리포지토리를 주입
  constructor(
    @InjectRepository(Showtime)
    private showtimesRepository: Repository<Showtime>,
  ) {}

  // 여러 개의 Showtime을 생성하는 메서드
  async createMany(
    createShowtimeDtos: CreateShowtimeDto[], // 생성할 Showtime의 DTO
    show: Show, // 연관된 Show 엔티티
  ): Promise<Showtime[]> {
    // DTO 배열을 통해 Showtime 엔티티 배열을 생성
    const showtimes = createShowtimeDtos.map((showtimeDto) => {
      const showtime = this.showtimesRepository.create(showtimeDto); // DTO를 엔티티로 변환
      showtime.show = show; // 연관된 Show 엔티티를 설정
      showtime.available_seats = show.total_seats; // 사용 가능한 좌석 수를 Show의 총 좌석 수로 설정
      return showtime; // 생성된 Showtime 엔티티를 반환
    });

    // 생성된 Showtime 엔티티 배열을 데이터베이스에 저장하고 반환
    return this.showtimesRepository.save(showtimes);
  }
}
