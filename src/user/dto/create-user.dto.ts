// class-validator 라이브러리에서 유효성 검사 데코레이터들을 import
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

// CreateUserDto 클래스 정의
export class CreateUserDto {
  // username 필드가 비어있지 않음을 검사
  @IsNotEmpty()
  username: string;

  // email 필드가 유효한 이메일 형식인지 검사
  @IsEmail()
  email: string;

  // password 필드가 비어있지 않음을 검사하고, 최소 길이를 8자리로 설정
  // 유효성 검사 실패 시 커스텀 에러 메시지를 설정
  @IsNotEmpty()
  @MinLength(8, { message: '비밀번호는 최소 8자리 이상이어야 합니다.' })
  password: string;
}
