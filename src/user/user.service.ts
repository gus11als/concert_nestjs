// 필요한 Nest.js 데코레이터와 예외 클래스들을 import
import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';

// TypeORM의 InjectRepository 데코레이터를 import
import { InjectRepository } from '@nestjs/typeorm';
// TypeORM의 Repository 클래스를 import
import { Repository } from 'typeorm';
// User 엔티티를 import
import { User } from './entities/user.entity';
// DTO(Data Transfer Object)들을 import
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
// bcrypt 라이브러리를 import
import * as bcrypt from 'bcrypt';
// jsonwebtoken 라이브러리를 import
import * as jwt from 'jsonwebtoken';
// ConfigService를 import
import { ConfigService } from '@nestjs/config';

// UserService 클래스를 Injectable 데코레이터로 주입
@Injectable()
export class UserService {
  // 생성자에서 User 엔티티의 리포지토리와 ConfigService를 주입
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private configService: ConfigService,
  ) {}

  // 회원가입 로직을 구현한 메서드
  async create(createUserDto: CreateUserDto): Promise<User> {
    const { username, email, password } = createUserDto;

    // 이미 존재하는 사용자인지 확인
    const existingUser = await this.usersRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      // 이미 사용자가 존재할 시
      throw new ConflictException('이미 등록한 사용자입니다.');
    }

    // Bcrypt를 사용하여 비밀번호를 해싱
    const saltRounds = parseInt(
      this.configService.get<string>('BCRYPT_SALT_ROUNDS'),
      10,
    );
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 새로운 사용자를 생성
    const user = this.usersRepository.create({
      username,
      email,
      password: hashedPassword,
    });

    // 사용자를 데이터베이스에 저장
    await this.usersRepository.save(user);
    return user;
  }

  // 로그인 로직을 구현한 메서드
  async login(loginUserDto: LoginUserDto): Promise<{ accessToken: string }> {
    const { email, password } = loginUserDto;
    // 이메일을 기준으로 사용자를 확인
    const user = await this.usersRepository.findOne({ where: { email } });

    if (!user) {
      // 사용자가 없을시
      throw new UnauthorizedException('이메일 또는 비밀번호가 틀렸습니다.');
    }

    // 입력한 비밀번호가 저장된 비밀번호와 일치하는지 확인
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      // 비밀번호가 일치하지 않을시
      throw new UnauthorizedException('비밀번호가 틀립니다.');
    }

    // JWT를 생성
    const payload = { userId: user.id };
    const secret = this.configService.get<string>('JWT_SECRET');
    const expiresIn = this.configService.get<string>('JWT_EXPIRATION');
    const accessToken = jwt.sign(payload, secret, { expiresIn });

    return { accessToken };
  }

  // 사용자 ID로 사용자를 찾는 메서드
  async findById(id: number): Promise<User> {
    // ID를 기준으로 사용자를 검색
    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      // 사용자를 찾을 수 없을 시
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    return user;
  }
}
