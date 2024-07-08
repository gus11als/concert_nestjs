// Nest.js의 Controller 데코레이터를 import
import { Controller } from '@nestjs/common';
// ShowtimeService를 import
import { ShowtimeService } from './showtime.service';

// 'showtimes' 경로를 가진 컨트롤러를 정의
@Controller('showtimes')
export class ShowtimeController {
  // ShowtimeService를 주입받는 생성자
  constructor(private readonly showtimeService: ShowtimeService) {}
}
