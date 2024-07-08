// Nest.js의 Module 데코레이터를 import
import { Module } from '@nestjs/common';
// TypeORM 모듈을 import
import { TypeOrmModule } from '@nestjs/typeorm';
// User 엔티티를 import
import { User } from './entities/user.entity';
// UserService를 import
import { UserService } from './user.service';
// UserController를 import
import { UserController } from './user.controller';

// UserModule을 정의
@Module({
  // TypeOrmModule.forFeature를 사용하여 User 엔티티를 TypeORM 모듈에 등록
  imports: [TypeOrmModule.forFeature([User])],
  // UserService를 이 모듈의 프로바이더로 등록
  providers: [UserService],
  // UserController를 이 모듈의 컨트롤러로 등록
  controllers: [UserController],
  // UserService와 TypeOrmModule을 내보내기(export) 설정하여 다른 모듈에서도 사용할 수 있게 함
  exports: [UserService, TypeOrmModule], // UserService와 TypeOrmModule 내보내기 추가
})
export class UserModule {}
