// Nest.js의 Module 데코레이터를 import
import { Module } from '@nestjs/common';
// TypeORM 모듈을 import
import { TypeOrmModule } from '@nestjs/typeorm';
// Show 엔티티를 import
import { Show } from './entities/show.entity';
// ShowService를 import
import { ShowService } from './show.service';
// ShowController를 import
import { ShowController } from './show.controller';
// ShowtimeModule을 import
import { ShowtimeModule } from '../showtime/showtime.module';

@Module({
  // TypeOrmModule.forFeature를 사용하여 Show 엔티티를 TypeORM 모듈에 등록
  // ShowtimeModule을 모듈에 추가하여 다른 모듈에서도 사용할 수 있게 함
  imports: [TypeOrmModule.forFeature([Show]), ShowtimeModule], // ShowtimeModule 임포트
  // ShowService를 이 모듈의 프로바이더로 등록
  providers: [ShowService],
  // ShowController를 이 모듈의 컨트롤러로 등록
  controllers: [ShowController],
})
export class ShowModule {}
