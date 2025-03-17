import { ApiProperty } from '@nestjs/swagger';

export class OtpDto {
  @ApiProperty()
  otp: string;
}
