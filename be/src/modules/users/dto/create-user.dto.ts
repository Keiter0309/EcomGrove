import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsNotEmpty, IsString, Matches, MinLength } from "class-validator"

export class CreateUserDto {
    @ApiProperty()
    @IsNotEmpty({ message: 'First name is requried' })
    @IsString({ message: "First name must be a string" })
    firstName: string

    @ApiProperty()
    @IsNotEmpty({ message: 'Last name is required' })
    @IsString({ message: "Last name must be a string" })
    lastName: string

    @ApiProperty()
    @IsNotEmpty({ message: 'Email is required' })
    @IsEmail()
    email: string

    @ApiProperty()
    @IsNotEmpty({ message: 'Username is required' })
    @IsString({ message: 'Username must be a string' })
    username: string

    @ApiProperty()
    @IsNotEmpty({ message: 'Password is required' })
    @IsString({ message: 'Password must be a string' })
    @MinLength(8, {
        message: 'Password must be at least 8 characters long.',
    })
    @Matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).*$/, {
        message:
            'Password must contain at least one uppercase letter and one special character.',
    })
    password: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'Phone number is required' })
    phoneNumber: string
}
