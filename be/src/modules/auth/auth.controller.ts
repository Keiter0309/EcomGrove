import {
  Controller,
  Post,
  Body,
  Res,
  Req,
  Get,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Helper } from 'src/utils/helper';
import { Request, Response } from 'express';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ForgotDto } from './dto/forgot.dto';
import { ResetPasswordDto } from './dto/reset.dto';
import { ChangePasswordDto } from './dto/changePassword.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('register')
  async register(@Body() registerDto: RegisterDto, @Res() res: Response) {
    try {
      const registerData = await this.authService.register(registerDto);
      if (!registerData.success) {
        return res.status(400).json({ message: registerData.message });
      }

      return res.status(200).json(registerData);
    } catch (error) {
      console.log(`Error while signing up ${error.message}`);
      return res.status(500).json({
        message: 'An unexpected error occured. Please try again later',
      });
    }
  }

  @Post('google')
  async googleLogin(@Body('token') token: string, @Res() res: Response) {
    try {
      const loginData = await this.authService.googleLogin(token);

      const ggToken = await loginData.token;
      Helper.SetCookieHelper(res, ggToken);

      if (!loginData.success) {
        return res.status(400).json(loginData.message);
      }

      return res.status(200).json(loginData.message);
    } catch (error) {
      console.error('Error while logging in:', error.message);
      return res.status(500).json({
        message: 'An unexpected error occurred. Please try again later.',
      });
    }
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    try {
      const loginData = await this.authService.login(loginDto);

      if (!loginData.success) {
        return res.status(400).json({ message: loginData.message });
      }

      Helper.SetCookieHelper(res, loginData.data.token);

      return res.status(200).json(loginData);
    } catch (error) {
      console.error('Error while logging in:', error.message);
      return res.status(500).json({
        message: 'An unexpected error occurred. Please try again later.',
      });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Res() res: Response) {
    try {
      Helper.ClearCookieHelper(res);

      return res.status(200).json({
        statusCode: 200,
        message: 'Logout successful',
      });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  @Post('forgot-password')
  async forgotPassword(@Body() forgotDto: ForgotDto, @Res() res: Response) {
    await this.authService.forgotPassword(forgotDto);

    return res.status(200).json({
      statusCode: 200,
      message: 'Send OTP Successful',
    });
  }

  @Post('reset-password')
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
    @Res() res: Response,
  ) {
    try {
      await this.authService.resetPassword(resetPasswordDto);

      return res.status(200).json({
        statusCode: 200,
        message: 'Password reset successful',
      });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Req() req: Request, @Res() res: Response) {
    try {
      const user = await req.user;

      const email = (user as any).email;

      const response = await this.authService.profile(email);

      return res.status(200).json(response);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const user = await req.user;
    const email = (user as any).email;
    const otp = req.headers.otp;
    try {
      const response = await this.authService.changePassword(
        email,
        changePasswordDto,
        String(otp),
      );

      if (!response.success) {
        return res.status(400).json(response);
      }

      return res.status(200).json(response);
    } catch (error) {
      return res.status(500).json({
        message: 'An unexpected error occurred. Please try again later.',
      });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('check-auth')
  async checkAuth(@Req() req: Request, @Res() res: Response) {
    return res.status(200).json({
      statusCode: 200,
      isAuthenticated: !!req.user,
      message: req.user
        ? 'Get user credentials successfully'
        : 'User not authenticated',
      data: req.user || null,
    });
  }
}
