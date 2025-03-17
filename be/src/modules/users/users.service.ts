import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { PrismaService } from 'src/database/prisma/prisma.service';
import * as argon from 'argon2';
import { UtilOtp } from 'src/utils/otp';
import { MailService } from 'src/utils/mail.service';
import { OtpDto } from './dto/otp.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly mailService: MailService,
  ) { }
  create(createUserDto: CreateUserDto) {
    const { firstName, lastName, email, username, password, phoneNumber } =
      createUserDto;
    try {
      return this.prismaService.$transaction(async (prisma) => {
        const existingUser = await prisma.user.findFirst({
          where: {
            OR: [{ email }, { username }],
          },
        });

        if (existingUser) {
          const message =
            existingUser.email === email
              ? 'Email is already registered'
              : 'Username is already taken';

          return {
            statusCode: 400,
            success: false,
            message,
          };
        }

        const hashedPassword = await argon.hash(password);

        const newUser = await prisma.user.create({
          data: {
            firstName,
            lastName,
            email,
            username,
            password: hashedPassword,
            phoneNumber,
          },
        });

        return {
          statusCode: 201,
          success: true,
          message: 'User created successfully',
          data: newUser,
        };
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Error while creating user',
        error.message,
      );
    }
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async sendOtpCode(email: string, username: string) {
    try {
      const otp = UtilOtp.generateOtp();
      const otpExpiry = UtilOtp.getOtpExpiration();

      await this.prismaService.user.update({
        where: { email },
        data: {
          passwordResetToken: String(otp),
          passwordResetExpiry: otpExpiry,
        },
      });

      await this.mailService.sendConfirmChangeInfoOtp(
        email,
        username,
        String(otp),
      );

      return {
        statusCode: 200,
        success: true,
        message: 'Email send successfully',
      };
    } catch (error) {
      console.error('Error while sending email:', error);
      throw new InternalServerErrorException();
    }
  }

  async updateUserProfile(
    userEmail: string,
    userUpdate: UpdateProfileDto,
    otp: string
  ) {
    const { firstName, lastName, username, email, phoneNumber } =
      userUpdate;
    try {
      return await this.prismaService.$transaction(async (prisma) => {
        const existingUser = await prisma.user.findFirst({
          where: {
            AND: [
              { email: { not: userEmail } },
              {
                OR: [{ email }, { username }, { phoneNumber }],
              },
            ],
          },
        });

        if (existingUser) {
          let message = '';
          if (existingUser.email === email) {
            message = 'Email is already registered';
          } else if (existingUser.username === username) {
            message = 'Username is already taken';
          } else if (existingUser.phoneNumber === phoneNumber) {
            message = 'Phone number is already registered';
          }

          return {
            statusCode: 400,
            success: false,
            message,
          };
        }

        const validOtp = await prisma.user.findUnique({
          where: { passwordResetToken: otp },
          select: { passwordResetExpiry: true },
        });

        if (!validOtp) {
          return {
            statusCode: 400,
            success: false,
            message: 'OTP is invalid',
          };
        }

        if (
          validOtp.passwordResetExpiry &&
          validOtp.passwordResetExpiry < new Date()
        ) {
          return {
            statusCode: 400,
            success: false,
            message: 'OTP has expired',
          };
        }

        const updatedUser = await prisma.user.update({
          where: { email: userEmail },
          data: {
            firstName,
            lastName,
            username,
            email,
            phoneNumber,
            passwordResetToken: null,
            passwordResetExpiry: null,
          },
        });

        return {
          statusCode: 200,
          success: true,
          message: 'User profile updated successfully',
          data: updatedUser,
        };
      });
    } catch (error) {
      console.error('Error while updating user profile:', error.message);
      throw new InternalServerErrorException();
    }
  }

  async uploadAvatar(imagePath: string, userEmail: string) {
    try {
      return await this.prismaService.$transaction(async (prisma) => {
        const existingUser = await prisma.user.findFirst({
          where: { email: userEmail }
        });

        if (!existingUser) {
          return {
            statusCode: 400,
            success: false,
            message: 'Invalid credentials',
          };
        }

        const updatedUser = await prisma.user.update({
          where: { email: userEmail },
          data: { profile_picture: imagePath }
        });

        if (!updatedUser) {
          return {
            statusCode: 500,
            success: false,
            message: 'Failed to update avatar',
          };
        }

        return {
          statusCode: 200,
          success: true,
          message: 'Avatar changed successfully'
        };
      });
    } catch (error) {
      console.error(`Error updating avatar for ${userEmail}: ${error.message}`);
      return {
        statusCode: 500,
        success: false,
        message: 'Internal Server Error',
      };
    }
  }


  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
