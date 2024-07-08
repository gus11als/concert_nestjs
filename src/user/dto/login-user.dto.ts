import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class LoginUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(8, { message: '비밀번호는 최소 8자리 이상이어야 합니다.' })
  password: string;
}
