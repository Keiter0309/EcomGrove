import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { PrismaService } from 'src/database/prisma/prisma.service';
import * as argon from 'argon2';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { MailService } from 'src/utils/mail.service';
import { UtilOtp } from 'src/utils/otp';
import { ForgotDto } from './dto/forgot.dto';
import { ResetPasswordDto } from './dto/reset.dto';
import { OAuth2Client } from 'google-auth-library';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ChangePasswordDto } from './dto/changePassword.dto';

@Injectable()
export class AuthService {
  private client = new OAuth2Client(`${process.env.GOOGLE_CLIENT_ID}`);

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) { }

  async register(registerDto: RegisterDto) {
    const { firstName, lastName, username, email, password, phoneNumber } =
      registerDto;

    try {
      return await this.prismaService.$transaction(async (prisma) => {
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
            username,
            email,
            password: hashedPassword,
            phoneNumber,
          },
        });

        return {
          statusCode: 201,
          success: true,
          message: 'Account created successfully',
          data: newUser,
        };
      });
    } catch (err: any) {
      console.error('Error while creating account', err);
      throw new BadRequestException('Error while creating account');
    }
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    try {
      const existingUser = await this.prismaService.user.findUnique({
        where: { email },
      });

      if (!existingUser) {
        return {
          statusCode: 400,
          success: false,
          message: 'These Credentials do not exist in the system',
        };
      }

      const passwordMatches = await argon.verify(
        existingUser.password,
        password,
      );

      if (!passwordMatches) {
        return {
          success: false,
          message: 'Invalid Credentials',
        };
      }

      const payload = {
        id: existingUser.id,
        firstName: existingUser.firstName,
        lastName: existingUser.lastName,
        username: existingUser.username,
        role: existingUser.role,
        email: existingUser.email,
        lastLogin: existingUser.lastLogin,
        status: existingUser.status,
        profilePic: existingUser.profile_picture,
        createdAt: existingUser.createdAt,
        token: '',
      };

      const accessToken = await this.signToken(payload);

      await this.cacheManager.set(`auth_${existingUser.id}`, accessToken, 3600);

      payload.token = accessToken;

      return {
        statusCode: 200,
        success: true,
        message: 'Login successful',
        data: payload,
      };
    } catch (err: any) {
      console.error('Error while logging in', err.message);
      return {
        success: false,
        message: 'An error occurred while logging in. Please try again later.',
      };
    }
  }

  async googleLogin(token: string) {
    try {
      const ticket = await this.client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID as string,
      });

      if (!ticket) {
        throw new UnauthorizedException('Invalid Google token');
      }

      const payload = ticket.getPayload();

      if (!payload) {
        throw new UnauthorizedException('Invalid Google payload');
      }

      const { sub, email, name, picture, given_name, family_name } = payload;

      const existingUser = await this.prismaService.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        if (existingUser.password) {
          return {
            statusCode: 400,
            success: false,
            message: 'This email has already been registered with a password. Please log in using your password.',
          };
        }

        const jwtToken = this.signToken({ sub, email, picture, name });
        return {
          statusCode: 200,
          success: true,
          message: 'Login successfully',
          token: jwtToken,
        };
      }

      await this.prismaService.user.create({
        data: {
          firstName: given_name,
          lastName: family_name || '',
          email,
          username: name,
          profile_picture: picture,
          password: '',
          googleId: sub,
        },
      });

      const jwtToken = this.signToken({ sub, email, picture, name });

      return {
        statusCode: 201,
        success: true,
        message: 'User registered and logged in successfully',
        token: jwtToken,
      };
    } catch (error) {
      console.error('Google login error:', error);
      throw new UnauthorizedException('Invalid token');
    }
  }


  async forgotPassword(payload: ForgotDto) {
    const { email } = payload;

    try {
      const existingUser = await this.prismaService.user.findUnique({
        where: { email },
      });
      if (!existingUser) {
        throw new BadRequestException(
          'These Credentials do not exist in system',
        );
      }
      const otp = UtilOtp.generateOtp();
      const otpExpiry = UtilOtp.getOtpExpiration();

      await this.prismaService.user.update({
        where: { email },
        data: {
          passwordResetToken: String(otp),
          passwordResetExpiry: otpExpiry,
        },
      });

      existingUser.passwordResetToken = String(otp);
      existingUser.passwordResetExpiry = otpExpiry;

      await this.mailService.sendResetPasswordOtp(
        existingUser.email,
        existingUser.username,
        String(otp),
        otpExpiry,
      );
    } catch (err: any) {
      console.error('Error while generating otp', err.message);
      throw new BadRequestException('Error while generating otp');
    }
  }

  async resetPassword(payload: ResetPasswordDto) {
    const { otp, password, confirmPassword } = payload;

    try {
      const user = await this.prismaService.user.findUnique({
        where: { passwordResetToken: otp },
      });

      if (!user) {
        throw new BadRequestException('Invalid OTP or expired OTP');
      }

      if (user.passwordResetExpiry && user.passwordResetExpiry < new Date()) {
        throw new BadRequestException('OTP has expired');
      }

      if (password != confirmPassword) {
        throw new BadRequestException('Password do not match');
      }

      const hashedPassword = await argon.hash(password);

      await this.prismaService.user.update({
        where: { id: user.id },
        data: {
          password: hashedPassword,
          passwordResetToken: null,
          passwordResetExpiry: null,
        },
      });

      await this.mailService.sendResetPasswordSuccess(
        user.email,
        user.username,
      );

      return;
    } catch (err: any) {
      console.error('Error while reseting password', err.message);
      throw new BadRequestException(
        'Error while reseting password',
        err.message,
      );
    }
  }

  async changePassword(email: string, changePasswordDto: ChangePasswordDto, otp: string) {
    const { currentPassword, newPassword, confirmNewPassword } = changePasswordDto;

    try {
      const existingUser = await this.prismaService.user.findUnique({
        where: { email }
      });

      if (!existingUser) {
        return {
          statusCode: 400,
          success: false,
          message: "These credentials do not exist in the system."
        };
      }

      if (existingUser.googleId) {
        return {
          statusCode: 400,
          success: false,
          message: "You signed in with Google. Password change is not allowed."
        };
      }

      const validOtp = await this.prismaService.user.findUnique({
        where: { passwordResetToken: otp },
        select: { passwordResetExpiry: true }
      })

      if (!validOtp) {
        return {
          statusCode: 400,
          success: false,
          message: 'OTP is invalid'
        }
      }

      if (validOtp.passwordResetExpiry && validOtp.passwordResetExpiry < new Date()) {
        return {
          statusCode: 400,
          success: false,
          message: 'OTP has expired'
        }
      }


      const isValidPassword = await argon.verify(existingUser.password, currentPassword);
      if (!isValidPassword) {
        return {
          statusCode: 400,
          success: false,
          message: "Invalid password."
        };
      }

      if (await argon.verify(existingUser.password, newPassword)) {
        return {
          statusCode: 400,
          success: false,
          message: "New password cannot be the same as the old password."
        };
      }

      if (newPassword !== confirmNewPassword) {
        return {
          statusCode: 400,
          success: false,
          message: "Passwords do not match."
        };
      }

      const hashedPassword = await argon.hash(newPassword);

      await this.prismaService.user.update({
        where: { email },
        data: { password: hashedPassword }
      });

      await this.mailService.sendPasswordChangeNotification(
        existingUser.email,
        existingUser.username
      )
      return {
        statusCode: 200,
        success: true,
        message: "Password changed successfully."
      };
    } catch (error) {
      console.error(`Error while changing password: ${error.message}`);
      return {
        statusCode: 500,
        success: false,
        message: "An unexpected error occurred. Please try again."
      };
    }
  }

  async profile(email: string) {
    try {
      const response = await this.prismaService.user.findUnique({
        where: { email: email },
        include: { Address: true, OrderHistory: true },
      });

      return {
        statusCode: 200,
        message: 'Fetched user profile successfully',
        data: response,
      };
    } catch (err: any) {
      console.error('Error while fetching user profile', err.message);
      throw new InternalServerErrorException('Failed to fetching user profile');
    }
  }

  async signToken(payload: Object) {
    const token = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
    });

    return token;
  }
}
