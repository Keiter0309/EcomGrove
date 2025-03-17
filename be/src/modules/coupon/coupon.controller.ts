import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Res,
  UseGuards,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CouponService } from './coupon.service';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { Request, Response } from 'express';
import { JwtCouponGuard } from './jwt-coupon.guard';
import { SoftDeleteDto } from './dto/soft-delete.dto';
import { PermanentDto } from './dto/permanent.dto';
import { RestoreDto } from './dto/restore.dto';

@Controller('coupon')
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @UseGuards(JwtCouponGuard)
  @Post('add-coupon')
  async create(
    @Body() createCouponDto: CreateCouponDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const id = await (req.user as any).id;
    const response = await this.couponService.create(createCouponDto, id);

    return res.status(201).json(response);
  }

  @UseGuards(JwtCouponGuard)
  @Get('fetch-all')
  async findAll(@Res() res: Response) {
    const response = await this.couponService.findAll();

    return res.status(200).json(response);
  }

  @UseGuards(JwtCouponGuard)
  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    const response = await this.couponService.findOne(+id);

    return res.status(200).json(response);
  }

  @UseGuards(JwtCouponGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCouponDto: UpdateCouponDto,
    @Res() res: Response,
  ) {
    const response = await this.couponService.update(+id, updateCouponDto);
    return res.status(200).json(response);
  }

  @UseGuards(JwtCouponGuard)
  @Post('restore')
  async restore(@Body() restoreDto: RestoreDto, @Res() res: Response) {
    if (!restoreDto.ids || restoreDto.ids.length === 0) {
      throw new BadRequestException('No coupon Ids provided for restoration');
    }

    const response = await this.couponService.restore(restoreDto.ids);
    return res.status(200).json(response);
  }

  @UseGuards(JwtCouponGuard)
  @Delete('soft-delete')
  async softDelete(@Body() softDeleteDto: SoftDeleteDto, @Res() res: Response) {
    if (!softDeleteDto.ids || softDeleteDto.ids.length === 0) {
      throw new BadRequestException(
        'No coupon IDs provided for soft deletion.',
      );
    }

    const response = await this.couponService.softDelete(softDeleteDto.ids);
    return res.status(200).json(response);
  }

  @UseGuards(JwtCouponGuard)
  @Get('fetch-all-deleted')
  async fetchAllDeleted(@Res() res: Response) {
    try {
      const response = await this.couponService.findAllSoftDeleted();
      return res.status(200).json(response);
    } catch (error) {
      console.error('Error while fetching data', error.message);
      throw new InternalServerErrorException();
    }
  }

  @UseGuards(JwtCouponGuard)
  @Delete('permanent-delete')
  async permanentDelete(
    @Body() permanentDeleteDto: PermanentDto,
    @Res() res: Response,
  ) {
    if (!permanentDeleteDto.ids || permanentDeleteDto.ids.length === 0) {
      throw new BadRequestException(
        'No coupon IDs provided for permanent deletion',
      );
    }

    const response = await this.couponService.permanentDelete(
      permanentDeleteDto.ids,
    );
    return res.status(200).json(response);
  }
}
