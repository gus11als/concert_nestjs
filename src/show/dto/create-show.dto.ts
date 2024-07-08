// class-validator 라이브러리에서 유효성 검사 데코레이터들을 import
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsArray,
  ValidateNested,
  IsOptional,
} from 'class-validator';
// class-transformer 라이브러리에서 Type 데코레이터를 import
import { Type } from 'class-transformer';
// CreateShowtimeDto를 import
import { CreateShowtimeDto } from '../../showtime/dto/create-showtime.dto';

// CreateShowDto 클래스 정의
export class CreateShowDto {
  // name 필드가 비어있지 않고 문자열인지 검사
  @IsNotEmpty()
  @IsString()
  name: string;

  // description 필드가 비어있지 않고 문자열인지 검사
  @IsNotEmpty()
  @IsString()
  description: string;

  // category 필드가 비어있지 않고 문자열인지 검사
  @IsNotEmpty()
  @IsString()
  category: string;

  // location 필드가 비어있지 않고 문자열인지 검사
  @IsNotEmpty()
  @IsString()
  location: string;

  // price 필드가 비어있지 않고 숫자인지 검사
  @IsNotEmpty()
  @IsNumber()
  price: number;

  // image_url 필드는 선택 사항이며 문자열인지 검사
  @IsOptional()
  @IsString()
  image_url?: string;

  // total_seats 필드가 비어있지 않고 숫자인지 검사
  @IsNotEmpty()
  @IsNumber()
  total_seats: number;

  // show_times 필드가 배열인지 검사하고, 배열의 각 요소에 대해 유효성 검사
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateShowtimeDto) // 배열 요소 타입을 CreateShowtimeDto로 변환
  show_times: CreateShowtimeDto[];
}
