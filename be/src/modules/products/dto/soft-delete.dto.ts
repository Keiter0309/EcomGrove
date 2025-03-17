import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

export class SoftDeleteDto {
  @ApiProperty()
  @IsArray()
  ids: number[];
}
