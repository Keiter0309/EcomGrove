import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateAddressDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'House number is required' })
  houseNumber: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Street is required' })
  @IsString({ message: 'Street must be a string' })
  street: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Ward is required' })
  @IsString({ message: 'Ward must be a string' })
  ward: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Ctiy is required' })
  @IsString({ message: 'City must be a string' })
  city: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'District is required' })
  @IsString({ message: 'District code must be a string' })
  district: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Country is required' })
  @IsString({ message: 'Country must be a string' })
  country: string;

  @ApiProperty({ default: 'false' })
  @IsOptional()
  isPrimary?: boolean;
}
