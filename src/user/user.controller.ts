// Nest.js의 데코레이터와 모듈들을 import
import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  Req,
} from '@nestjs/common';
// UserService를 import
import { UserService } from './user.service';
// DTO(Data Transfer Object)들을 import
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
// Express의 Request 객체를 import
import { Request } from 'express';

// 'user' 경로를 가진 컨트롤러를 정의
@Controller('user')
export class UserController {
  // UserService를 주입받는 생성자
  constructor(private readonly userService: UserService) {}

  // 'signup' 경로로 들어오는 POST 요청을 처리
  @Post('signup')
  // HTTP 상태 코드를 201 (Created)로 설정
  @HttpCode(HttpStatus.CREATED)
  async signUp(@Body() createUserDto: CreateUserDto) {
    // UserService의 create 메서드를 호출하여 새로운 사용자를 생성
    const user = await this.userService.create(createUserDto);

    // 사용자 생성에 성공하면 응답을 반환
    return {
      status: 201,
      message: '회원가입에 성공했습니다.',
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        points: user.points,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
      },
    };
  }

  // 'login' 경로로 들어오는 POST 요청을 처리
  @Post('login')
  // HTTP 상태 코드를 200 (OK)로 설정
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginUserDto: LoginUserDto) {
    // UserService의 login 메서드를 호출하여 사용자 로그인 처리 및 JWT 발급
    const { accessToken } = await this.userService.login(loginUserDto);
    // 로그인 성공 시 응답을 반환
    return {
      status: 200,
      message: '로그인에 성공했습니다.',
      data: {
        accessToken,
      },
    };
  }

  // 'profile' 경로로 들어오는 GET 요청을 처리
  @Get('profile')
  // HTTP 상태 코드를 200 (OK)로 설정
  @HttpCode(HttpStatus.OK)
  async getProfile(@Req() req: Request) {
    // UserService의 findById 메서드를 호출하여 사용자의 정보를 조회
    const user = await this.userService.findById(req['user'].id);

    // 사용자 정보 조회 성공 시 응답을 반환
    return {
      status: 200,
      message: '사용자 정보를 조회했습니다.',
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        points: user.points,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
      },
    };
  }
}
