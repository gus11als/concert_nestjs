// Reservation 엔티티를 import하여 User 엔티티와 관계를 설정
import { Reservation } from 'src/reservation/entities/reservation.entity';

// TypeORM 데코레이터와 관련된 모듈들을 import
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
  OneToMany,
} from 'typeorm';

// 엔티티 데코레이터로 이 클래스가 엔티티임
@Entity()
// 이메일 컬럼의 값이 유니크
@Unique(['email'])
export class User {
  // 기본 키로 사용될 자동 생성 컬럼을 정의
  @PrimaryGeneratedColumn()
  id: number;

  // 사용자 이름을 저장하는 컬럼을 정의
  @Column()
  username: string;

  // 이메일을 저장하는 컬럼을 정의
  @Column()
  email: string;

  // 비밀번호를 저장하는 컬럼을 정의
  @Column()
  password: string;

  // 사용자의 포인트를 저장하는 컬럼을 정의 기본값은 1000000
  @Column({ default: 1000000 })
  points: number;

  // 사용자 관리자 여부를 나타내는 컬럼을 정의기본값은 false
  @Column({ default: false })
  is_admin: boolean;

  // 엔티티가 생성된 날짜와 시간을 자동으로 기록하는 컬럼을 정의합니다.
  @CreateDateColumn()
  created_at: Date;

  // 엔티티가 업데이트된 날짜와 시간을 자동으로 기록하는 컬럼을 정의합니다.
  @UpdateDateColumn()
  updated_at: Date;

  // 일대다 관계를 설정하여, 한 명의 사용자가 여러 개의 예약을 가질 수 있음을 나타냄
  // reservation.user는 Reservation 엔티티에서 이 사용자와의 관계를 정의한 부분
  @OneToMany(() => Reservation, (reservation) => reservation.user)
  reservations: Reservation[];
}
