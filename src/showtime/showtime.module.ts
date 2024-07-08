import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Showtime } from './entities/showtime.entity';
import { ShowtimeService } from './showtime.service';
import { ShowtimeController } from './showtime.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Showtime])],
  providers: [ShowtimeService],
  controllers: [ShowtimeController],
  exports: [ShowtimeService], // 내보내기 추가
})
export class ShowtimeModule {}
