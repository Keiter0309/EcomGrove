import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class ProductImageDto {
  @ApiProperty({ description: 'Image name' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Image URL' })
  @IsString()
  url: string;
}

export class CreateProductDto {
  @ApiProperty({ description: 'Product name' })
  @IsNotEmpty({ message: 'Product name is required' })
  @IsString({ message: 'Product name must be a string' })
  name: string;

  @ApiProperty({ description: 'Product description' })
  @IsNotEmpty({ message: 'Product description is required' })
  @IsString({ message: 'Product description must be a string' })
  description: string;

  @ApiProperty({ type: 'number', format: 'decimal', description: 'Product price' })
  @IsNumber({}, { message: 'Price must be a number' })
  @Transform(({ value }) => parseFloat(value))
  price: number;

  @ApiProperty({ type: 'number', format: 'integer', description: 'Stock quantity' })
  @IsNumber({}, { message: 'Stock must be a number' })
  @Transform(({ value }) => parseInt(value))
  stock: number;

  @ApiProperty({
    type: [ProductImageDto],
    format: 'binary',
    isArray: true,
    description: 'Upload up to 5 product images',
  })
  imagePath: ProductImageDto[];

  @ApiProperty({ type: Number, description: 'Category ID (optional)' })
  @IsOptional()
  @Transform(({ value }) => (value ? parseInt(value) : null))
  categoryId?: number;
}
