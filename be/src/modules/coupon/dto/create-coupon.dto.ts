import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCouponDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Code is required' })
  @IsString({ message: 'Code must be a string' })
  code: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Discount is required' })
  discount: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'Coupon expires is required' })
  expiresAt: Date;
}
