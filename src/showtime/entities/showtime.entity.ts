// Reservation 엔티티를 import하여 Showtime 엔티티와 관계를 설정
import { Reservation } from 'src/reservation/entities/reservation.entity';
// Show 엔티티를 import하여 Showtime 엔티티와 관계를 설정
import { Show } from 'src/show/entities/show.entity';
// TypeORM의 데코레이터와 관련된 모듈들을 import
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

// 엔티티 데코레이터로 이 클래스가 엔티티임을 나타냄
@Entity()
export class Showtime {
  // 기본 키로 사용될 자동 생성 컬럼을 정의
  @PrimaryGeneratedColumn()
  id: number;

  // 다대일 관계를 설정하여 여러 Showtime이 하나의 Show에 속할 수 있음을 나타냄
  @ManyToOne(() => Show, (show) => show.showtimes)
  show: Show;

  // 상영 날짜를 저장하는 컬럼을 정의
  @Column()
  date: string;

  // 상영 시작 시간을 저장하는 컬럼을 정의
  @Column()
  start_time: string;

  // 상영 종료 시간을 저장하는 컬럼을 정의
  @Column()
  end_time: string;

  // 사용 가능한 좌석 수를 저장하는 컬럼을 정의
  @Column()
  available_seats: number;

  // 엔티티가 생성된 날짜와 시간을 자동으로 기록하는 컬럼을 정의
  @CreateDateColumn()
  created_at: Date;

  // 엔티티가 업데이트된 날짜와 시간을 자동으로 기록하는 컬럼을 정의
  @UpdateDateColumn()
  updated_at: Date;

  // 일대다 관계를 설정하여, 하나의 Showtime이 여러 개의 예약을 가질 수 있음을 나타냄
  @OneToMany(() => Reservation, (reservation) => reservation.showtime)
  reservations: Reservation[];
}
