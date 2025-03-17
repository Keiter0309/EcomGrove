import { PartialType } from '@nestjs/mapped-types';
import { CreateCartDto } from './create-cart.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class UpdateCartDto {
  @ApiProperty()
  @IsInt()
  cartItemId: number;

  @ApiProperty()
  @IsInt()
  quantity: number;
}
