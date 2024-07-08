// Nest.js의 데코레이터와 모듈들을 import
import { Controller, Post, Get, Body, Query, Param, Req } from '@nestjs/common';
// ShowService를 import
import { ShowService } from './show.service';
// DTO(Data Transfer Object)를 import
import { CreateShowDto } from './dto/create-show.dto';
// Express의 Request 객체를 import
import { Request } from 'express';

// 'show' 경로를 가진 컨트롤러를 정의
@Controller('show')
export class ShowController {
  // ShowService를 주입받는 생성자
  constructor(private readonly showService: ShowService) {}

  // 'show' 경로로 들어오는 POST 요청을 처리하여 새로운 쇼를 생성
  @Post()
  async create(@Body() createShowDto: CreateShowDto, @Req() req: Request) {
    // 요청한 사용자가 관리자 권한이 있는지 확인
    if (!req['user'] || !req['user'].is_admin) {
      return {
        statusCode: 403,
        message: '접근 권한이 없습니다.',
      };
    }

    // ShowService의 create 메서드를 호출하여 새로운 쇼를 생성
    const show = await this.showService.create(createShowDto);

    // 생성된 쇼와 관련된 모든 쇼타임 정보를 가져
    const fullShow = await this.showService.findShowWithShowtimes(show.id);

    // 생성된 쇼와 쇼타임 정보를 응답으로 반환
    return {
      message: '공연이 성공적으로 생성되었습니다',
      show: fullShow,
    };
  }

  // 'show' 경로로 들어오는 GET 요청을 처리하여 모든 쇼를 조회 카테고리로 필터링
  @Get()
  async findAll(@Query('category') category: string) {
    const shows = await this.showService.findAllShows(category);
    return { shows };
  }

  // 'show/search' 경로로 들어오는 GET 요청을 처리하여 이름으로 쇼를 검색
  @Get('search')
  async search(@Query('name') name: string) {
    const shows = await this.showService.searchShows(name);
    return { shows };
  }

  // 'show/:id' 경로로 들어오는 GET 요청을 처리하여 ID로 특정 쇼를 조회
  @Get(':id')
  async findById(@Param('id') id: number) {
    const show = await this.showService.findShowById(id);
    return { show };
  }
}
