import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class RemoveProductDto {
  @ApiProperty()
  // @IsInt()
  cartItemId: number;
}
