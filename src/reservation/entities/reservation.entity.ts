// Show 엔티티를 import하여 Reservation 엔티티와 관계를 설정
import { Show } from 'src/show/entities/show.entity';
// Showtime 엔티티를 import하여 Reservation 엔티티와 관계를 설정
import { Showtime } from 'src/showtime/entities/showtime.entity';
// User 엔티티를 import하여 Reservation 엔티티와 관계를 설정
import { User } from 'src/user/entities/user.entity';
// TypeORM의 데코레이터와 관련된 모듈들을 import
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';

// 엔티티 데코레이터로 이 클래스가 엔티티임을 나타냄
@Entity()
export class Reservation {
  // 기본 키로 사용될 자동 생성 컬럼을 정의
  @PrimaryGeneratedColumn()
  id: number;

  // 다대일 관계를 설정하여 여러 Reservation이 하나의 User에 속할 수 있음을 나타냄
  @ManyToOne(() => User, (user) => user.reservations)
  user: User;

  // 다대일 관계를 설정하여 여러 Reservation이 하나의 Show에 속할 수 있음을 나타냄
  @ManyToOne(() => Show, (show) => show.reservations)
  show: Show;

  // 다대일 관계를 설정하여 여러 Reservation이 하나의 Showtime에 속할 수 있음을 나타냄
  @ManyToOne(() => Showtime, (showtime) => showtime.reservations)
  showtime: Showtime;

  // 예약의 상태를 저장하는 컬럼을 정의 기본값은 'confirm'
  @Column({ default: 'confirm' })
  status: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
