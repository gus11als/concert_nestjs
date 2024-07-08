// Nest.js의 Injectable, NestMiddleware, UnauthorizedException를 import
import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
// Express의 Request, Response, NextFunction 타입을 import
import { Request, Response, NextFunction } from 'express';
// jsonwebtoken 라이브러리를 import
import * as jwt from 'jsonwebtoken';
// ConfigService를 import
import { ConfigService } from '@nestjs/config';
// TypeORM의 InjectRepository 데코레이터와 Repository 클래스를 import
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// User 엔티티를 import
import { User } from 'src/user/entities/user.entity';

// JwtMiddleware 클래스를 정의하고, NestMiddleware 구현
@Injectable()
export class JwtMiddleware implements NestMiddleware {
  // 생성자에서 ConfigService와 User 엔티티의 리포지토리를 주입
  constructor(
    private configService: ConfigService,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  // 미들웨어로 사용될 use 메서드를 정의
  async use(req: Request, res: Response, next: NextFunction) {
    // Authorization 헤더를 가져오는부분
    const authHeader = req.headers.authorization;
    // Authorization 헤더가 없거나 형식이 잘못된 경우 예외를 발생
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('토큰이 유효하지 않습니다.');
    }

    // 토큰을 추출
    const token = authHeader.split(' ')[1];
    // 환경 변수에서 JWT 비밀키를 가져옴
    const secret = this.configService.get<string>('JWT_SECRET');

    try {
      // 토큰을 검증하고 디코딩
      const decoded = jwt.verify(token, secret) as { userId: number };
      // 디코딩된 정보에서 사용자 ID를 이용해 사용자를 조회
      const user = await this.usersRepository.findOne({
        where: { id: decoded.userId },
      });

      // 사용자가 존재하지 않으면 예외를 발생
      if (!user) {
        throw new UnauthorizedException('유효하지 않은 토큰입니다.');
      }

      // 요청 객체에 사용자 정보를 추가
      req['user'] = user;
      // 다음 미들웨어 또는 라우터로 요청을 전달
      next();
    } catch (error) {
      // 토큰 검증 중 오류가 발생하면 예외를 발생
      throw new UnauthorizedException('유효하지 않은 토큰입니다.');
    }
  }
}
