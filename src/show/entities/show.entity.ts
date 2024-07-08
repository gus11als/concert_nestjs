// Reservation 엔티티를 import하여 Show 엔티티와 관계를 설정
import { Reservation } from 'src/reservation/entities/reservation.entity';
// Showtime 엔티티를 import하여 Show 엔티티와 관계를 설정
import { Showtime } from 'src/showtime/entities/showtime.entity';
// TypeORM의 데코레이터와 관련된 모듈들을 import
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity()
export class Show {
  // 기본 키로 사용될 자동 생성 컬럼을 정의
  @PrimaryGeneratedColumn()
  id: number;

  // 쇼의 이름을 저장하는 컬럼을 정의
  @Column()
  name: string;

  // 쇼의 설명을 저장하는 텍스트 형식의 컬럼을 정의
  @Column('text')
  description: string;

  // 쇼의 카테고리를 저장하는 컬럼을 정의
  @Column()
  category: string;

  // 쇼가 열리는 장소를 저장하는 컬럼을 정의
  @Column()
  location: string;

  // 쇼의 가격을 저장하는 컬럼을 정의
  @Column()
  price: number;

  // 쇼의 이미지 URL을 저장하는 컬럼을 정의 이 컬럼은 nullable로 설정
  @Column({ nullable: true })
  image_url: string;

  // 쇼의 총 좌석 수를 저장하는 컬럼을 정의
  @Column()
  total_seats: number;

  // 엔티티가 생성된 날짜와 시간을 자동으로 기록하는 컬럼을 정의
  @CreateDateColumn()
  created_at: Date;

  // 엔티티가 업데이트된 날짜와 시간을 자동으로 기록하는 컬럼을 정의
  @UpdateDateColumn()
  updated_at: Date;

  // 일대다 관계를 설정하여, 한 쇼가 여러 개의 상영 시간을 가질 수 있음을 나타냄.
  // cascade: true 옵션을 설정하여 쇼가 삭제되면 관련된 상영 시간들도 자동으로 삭제
  @OneToMany(() => Showtime, (showtime) => showtime.show, { cascade: true })
  showtimes: Showtime[];

  // 일대다 관계를 설정하여, 한 쇼가 여러 개의 예약을 가질 수 있음을 나타냄
  @OneToMany(() => Reservation, (reservation) => reservation.show)
  reservations: Reservation[];
}
