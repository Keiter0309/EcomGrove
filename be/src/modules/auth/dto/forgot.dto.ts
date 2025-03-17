import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class ForgotDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
