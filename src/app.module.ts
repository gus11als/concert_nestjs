// Nest.js의 Module, MiddlewareConsumer, RequestMethod, NestModule 데코레이터를 import
import {
  Module,
  MiddlewareConsumer,
  RequestMethod,
  NestModule,
} from '@nestjs/common';
// ConfigModule을 import
import { ConfigModule } from '@nestjs/config';
// TypeORM 모듈을 import
import { TypeOrmModule } from '@nestjs/typeorm';
// 사용자 모듈을 import
import { UserModule } from './user/user.module';
// JWT 미들웨어를 import
import { JwtMiddleware } from './middleware/jwt.middleware';
// 공연 모듈을 import
import { ShowModule } from './show/show.module';
// 공연 시간 모듈을 import
import { ShowtimeModule } from './showtime/showtime.module';
// 예약 모듈을 import
import { ReservationModule } from './reservation/reservation.module';

// AppModule을 정의
@Module({
  // ConfigModule, TypeOrmModule, UserModule, ShowModule, ShowtimeModule, ReservationModule을 애플리케이션 모듈로 등록
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // ConfigModule을 전역 모듈로 설정
    }),
    TypeOrmModule.forRoot({
      type: 'mysql', // 데이터베이스 타입을 MySQL로 설정
      host: process.env.DB_HOST, // 데이터베이스 호스트를 환경 변수에서 가져옴
      port: parseInt(process.env.DB_PORT, 10), // 데이터베이스 포트를 환경 변수에서 가져와 정수로 변환
      username: process.env.DB_USERNAME, // 데이터베이스 사용자 이름을 환경 변수에서 가져옴
      password: process.env.DB_PASSWORD, // 데이터베이스 비밀번호를 환경 변수에서 가져옴
      database: process.env.DB_DATABASE, // 데이터베이스 이름을 환경 변수에서 가져옴
      entities: [__dirname + '/**/*.entity{.ts,.js}'], // 엔티티 파일의 경로를 설정
      synchronize: true, // 애플리케이션이 시작될 때 데이터베이스 스키마를 동기화
    }),
    UserModule, // User 모듈을 등록
    ShowModule, // Show 모듈을 등록
    ShowtimeModule, // Showtime 모듈을 등록
    ReservationModule, // Reservation 모듈을 등록
  ],
})
// NestModule 인터페이스를 구현하여 미들웨어를 설정할 수 있게 하는부분
export class AppModule implements NestModule {
  // 미들웨어를 구성하는 메서드
  configure(consumer: MiddlewareConsumer) {
    consumer
      // JwtMiddleware를 적용
      .apply(JwtMiddleware)
      // 특정 경로에 대해 미들웨어를 설정
      .forRoutes(
        { path: 'show', method: RequestMethod.POST }, // POST 요청에 대해 'show' 경로에 적용
        { path: 'show/reservation', method: RequestMethod.POST }, // POST 요청에 대해 'show/reservation' 경로에 적용
        { path: 'show/reservation/user', method: RequestMethod.GET }, // GET 요청에 대해 'show/reservation/user' 경로에 적용
        { path: 'user/profile', method: RequestMethod.GET }, // GET 요청에 대해 'user/profile' 경로에 적용
      );
  }
}
