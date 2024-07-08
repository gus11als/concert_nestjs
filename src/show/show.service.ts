// 필요한 Nest.js 데코레이터와 예외 클래스들을 import
import {
  Injectable, // 이 클래스가 Nest.js의 의존성 주입 시스템에 의해 관리되도록 하는 데코레이터
  ConflictException, // 예외: 이미 존재하는 리소스를 생성하려고 할 때 사용
  NotFoundException, // 예외: 찾고자 하는 리소스를 찾을 수 없을 때 사용
  BadRequestException, // 예외: 클라이언트의 요청이 잘못되었을 때 사용
} from '@nestjs/common';
// TypeORM의 InjectRepository 데코레이터를 import
import { InjectRepository } from '@nestjs/typeorm';
// TypeORM의 Repository 클래스를 import
import { Repository } from 'typeorm';
// Show 엔티티를 import
import { Show } from './entities/show.entity';
// DTO(Data Transfer Object)를 import
import { CreateShowDto } from './dto/create-show.dto';
// ShowtimeService를 import
import { ShowtimeService } from '../showtime/showtime.service';

@Injectable() // 이 클래스가 의존성 주입
export class ShowService {
  // 생성자에서 Show 엔티티의 리포지토리와 ShowtimeService를 주입
  constructor(
    @InjectRepository(Show)
    private showsRepository: Repository<Show>, // Show 엔티티에 대한 리포지토리
    private readonly showtimeService: ShowtimeService, // ShowtimeService를 주입
  ) {}

  // 새로운 쇼를 생성하는 메서드
  async create(createShowDto: CreateShowDto): Promise<Show> {
    // DTO에서 필요한 값을 추출
    const {
      name,
      description,
      category,
      location,
      price,
      image_url,
      total_seats,
      show_times,
    } = createShowDto;

    //쇼타임이 없을 경우 예외를 발생
    if (!show_times || show_times.length === 0) {
      throw new BadRequestException('공연시간을 넣어주세요');
    }

    //동일한 쇼타임 중복 및 겹치는 시간 확인
    const showtimeSet = new Set();
    for (const showtimeDto of show_times) {
      //중복되는 쇼타임을 확인하기 위한 키 생성
      const key = `${showtimeDto.date}-${showtimeDto.start_time}-${showtimeDto.end_time}`;
      showtimeSet.add(key);

      // 다른 쇼타임과의 겹치는 시간을 확인
      for (const otherShowtime of show_times) {
        if (
          showtimeDto !== otherShowtime &&
          showtimeDto.date === otherShowtime.date
        ) {
          if (
            (showtimeDto.start_time < otherShowtime.end_time &&
              showtimeDto.end_time > otherShowtime.start_time) ||
            (otherShowtime.start_time < showtimeDto.end_time &&
              otherShowtime.end_time > showtimeDto.start_time)
          ) {
            throw new BadRequestException('공연시간이 겹칩니다.');
          }
        }
      }
    }

    // 동일한 이름, 장소, 가격을 가진 쇼가 이미 있는지 확인
    let show = await this.showsRepository.findOne({
      where: {
        name,
        location,
        price,
        description,
        category,
        image_url,
        total_seats,
      },
      relations: ['showtimes'],
    });

    // 동일한 조건의 쇼가 없으면 새로운 쇼를 생성
    if (!show) {
      show = this.showsRepository.create({
        name,
        description,
        category,
        location,
        price,
        image_url,
        total_seats,
      });

      // 새로운 쇼를 데이터베이스에 저장
      await this.showsRepository.save(show);
      show.showtimes = []; // 새로운 쇼를 생성할 때 showtimes를 빈 배열로 초기화
    } else {
      // 동일한 조건의 쇼가 있으면 각 쇼타임이 중복되지 않는지 확인
      for (const showtimeDto of show_times) {
        const existingShowtime = show.showtimes.find(
          (showtime) =>
            showtime.date === showtimeDto.date &&
            showtime.start_time === showtimeDto.start_time &&
            showtime.end_time === showtimeDto.end_time,
        );

        if (existingShowtime) {
          throw new ConflictException('해당 시간에는 이미 공연이 존재합니다.');
        }
      }
    }

    // 새로운 쇼타임들을 생성하고 쇼에 연결
    const showtimes = await this.showtimeService.createMany(show_times, show);
    show.showtimes.push(...showtimes); // showtimes를 배열로 초기화한 후 push를 사용

    // 변경된 쇼 객체를 데이터베이스에 저장
    await this.showsRepository.save(show);

    return show; // 생성된 쇼 객체를 반환
  }

  // ID로 쇼와 관련된 쇼타임을 조회하는 메서드
  async findShowWithShowtimes(id: number): Promise<Show> {
    // ID로 쇼를 찾습니다. 관련된 쇼타임도 함께 가져옴
    const show = await this.showsRepository.findOne({
      where: { id },
      relations: ['showtimes'],
    });
    if (!show) {
      throw new NotFoundException('공연을 찾을 수 없습니다.');
    }
    return show;
  }

  // 모든 쇼를 조회하는 메서드입니다. 카테고리로 필터링
  async findAllShows(category?: string): Promise<any[]> {
    // 쿼리빌더를 사용하여 쇼와 관련된 쇼타임을 조회
    const query = this.showsRepository
      .createQueryBuilder('show')
      .leftJoinAndSelect('show.showtimes', 'showtime');

    // 카테고리로 필터링
    if (category) {
      query.where('show.category = :category', { category });
    }

    // 쿼리를 실행하고 결과를 반환
    const shows = await query.getMany();
    return shows.map((show) => ({
      id: show.id,
      name: show.name,
      description: show.description,
      category: show.category,
      location: show.location,
      price: show.price,
      image_url: show.image_url,
      total_seats: show.total_seats,
      show_times: show.showtimes
        .map((showtime) => ({
          id: showtime.id,
          date: showtime.date,
          start_time: showtime.start_time,
          end_time: showtime.end_time,
          available_seats: showtime.available_seats,
          created_at: showtime.created_at,
          updated_at: showtime.updated_at,
        }))
        .sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
        ), // 날짜 순으로 정렬
      created_at: show.created_at,
      updated_at: show.updated_at,
    }));
  }

  // 이름으로 쇼를 검색하는 메서드
  async searchShows(name: string): Promise<any[]> {
    // 이름으로 쇼를 검색하고 관련된 쇼타임을 함께 조회
    const shows = await this.showsRepository
      .createQueryBuilder('show')
      .leftJoinAndSelect('show.showtimes', 'showtime')
      .where('show.name LIKE :name', { name: `%${name}%` })
      .getMany();

    // 검색 결과를 반환
    return shows.map((show) => ({
      id: show.id,
      name: show.name,
      description: show.description,
      category: show.category,
      location: show.location,
      price: show.price,
      image_url: show.image_url,
      total_seats: show.total_seats,
      show_times: show.showtimes
        .map((showtime) => ({
          id: showtime.id,
          date: showtime.date,
          start_time: showtime.start_time,
          end_time: showtime.end_time,
          available_seats: showtime.available_seats,
          created_at: showtime.created_at,
          updated_at: showtime.updated_at,
        }))
        .sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
        ), // 날짜 순으로 정렬
      created_at: show.created_at,
      updated_at: show.updated_at,
    }));
  }

  // ID로 쇼를 찾는 메서드
  async findShowById(id: number): Promise<any> {
    // ID로 쇼를 찾고 관련된 쇼타임도 함께 조회
    const show = await this.showsRepository.findOne({
      where: { id },
      relations: ['showtimes'],
    });
    if (!show) {
      throw new NotFoundException('공연을 찾을 수 없습니다.');
    }
    // 조회 결과를 반환
    return {
      id: show.id,
      name: show.name,
      description: show.description,
      category: show.category,
      location: show.location,
      price: show.price,
      image_url: show.image_url,
      total_seats: show.total_seats,
      show_times: show.showtimes
        .map((showtime) => ({
          id: showtime.id,
          date: showtime.date,
          start_time: showtime.start_time,
          end_time: showtime.end_time,
          available_seats: showtime.available_seats,
          created_at: showtime.created_at,
          updated_at: showtime.updated_at,
        }))
        .sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
        ), // 날짜 순으로 정렬
      created_at: show.created_at,
      updated_at: show.updated_at,
    };
  }
}
