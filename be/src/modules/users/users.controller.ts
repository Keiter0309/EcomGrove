import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  Res,
  Req,
  UseGuards,
  UploadedFiles,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Request, Response } from 'express';
import { JwtUserGuard } from './jwt-user.guard';
import { JwtAdminGuard } from './jwt-admin.guard';
import { UploadAvatarDto } from './dto/upload-avatar.dto';
import { ApiConsumes } from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/common/configs/multer.config';
import { S3Utils } from 'src/utils/s3.util';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @UseGuards(JwtAdminGuard)
  @Post('create-user')
  async create(
    @Body() createUserDto: CreateUserDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const userData = await this.usersService.create(createUserDto);
      if (!userData.success) {
        return res.status(400).json({ message: userData.message });
      }

      return res.status(201).json(userData);
    } catch (error) {
      console.log(`Error while creating user ${error.message}`);
      return res.status(500).json({
        message: 'An unexpected error occurred. Please try again later',
      });
    }
  }

  @UseGuards(JwtUserGuard)
  @Post('update-profile')
  async updateUserProfile(
    @Body() updateProfileDto: UpdateProfileDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const email = (req.user as any).email;
    const otp = req.headers.otp;

    try {
      const updateProfileData = await this.usersService.updateUserProfile(
        email,
        updateProfileDto,
        String(otp),
      );

      if (!updateProfileData.success) {
        return res.status(400).json({ message: updateProfileData });
      }

      return res.status(200).json(updateProfileData);
    } catch (error) {
      console.log(`Error while updating ${error.message}`);
      return res.status(500).json({
        message: 'An unexpected error occured. Please try again later',
      });
    }
  }


  @UseGuards(JwtUserGuard)
  @Post('send-otp-code')
  async sendOtpCode(@Req() req: Request, @Res() res: Response) {
    try {
      const email = (req.user as any).email;
      const username = (req.user as any).username;
      const response = await this.usersService.sendOtpCode(email, username);

      return res.status(200).json(response);
    } catch (error) {
      console.error(`Error while sending otp ${error.message}`);
      return res.status(500).json({
        message: 'An unexpectec error occured. Please try again later',
      });
    }
  }

  @UseGuards(JwtUserGuard)
  @ApiConsumes('multipart/form-data')
  @Post('upload-avatar')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'imagePath', maxCount: 1 }], multerOptions),
  )
  async uploadAvatar(
    @Body() uploadAvatarDto: UploadAvatarDto,
    @UploadedFiles() files: { imagePath?: Express.Multer.File[] },
    @Req() req: Request
  ) {
    if (!files || !files.imagePath || files.imagePath.length === 0) {
      throw new BadRequestException('Image file is required');
    }

    const file = files.imagePath[0];
    const upload = await S3Utils.uploadToS3({ imagePath: file }, 'avatar');

    const email = (req.user as any).email;
    const response = await this.usersService.uploadAvatar(upload.url, email);

    return response;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
