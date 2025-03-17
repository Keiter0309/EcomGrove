import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UpdateProfileDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'First name is requried' })
  @IsString({ message: 'First name must be a string' })
  firstName: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Last name is required' })
  @IsString({ message: 'Last name must be a string' })
  lastName: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Username is required' })
  @IsString({ message: 'Username must be a string' })
  username: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Phone number is required' })
  phoneNumber: string;
}

export class UpdateProfileRequest {
  @ApiProperty()
  userUpdate: UpdateProfileDto;

  @ApiProperty()
  otp: string;
}

