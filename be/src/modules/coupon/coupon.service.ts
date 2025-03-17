import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { PrismaService } from 'src/database/prisma/prisma.service';

@Injectable()
export class CouponService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(createCouponDto: CreateCouponDto, userId: number) {
    const { code, discount, expiresAt } = createCouponDto;

    try {
      const existingCoupon = await this.prismaService.coupon.findUnique({
        where: { code: code },
      });

      if (existingCoupon) {
        throw new BadRequestException('Coupon already exists');
      }

      const couponData = await this.prismaService.coupon.create({
        data: {
          code,
          discount,
          expiresAt,
          userId,
        },
      });

      return {
        statusCode: 201,
        message: 'Coupon created successfully',
        data: couponData,
      };
    } catch (err: any) {
      console.error('Error while creating new coupon', err.message);
      throw new InternalServerErrorException('Failed to create new coupon');
    }
  }

  async findAll(page: number = 1, limit: number = 10) {
    try {
      const skip = (page - 1) * limit;
      const [couponData, total] = await Promise.all([
        this.prismaService.coupon.findMany({
          where: { isDeleted: false },
          skip,
          take: limit,
        }),
        this.prismaService.coupon.count({ where: { isDeleted: false } }),
      ]);
      return {
        statusCode: 200,
        message: 'Fetched all coupon successfully',
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        data: couponData,
      };
    } catch (err: any) {
      console.error('Error while fetched all coupon data', err.message);
      throw new InternalServerErrorException('Failed to fetch all coupon data');
    }
  }

  async findOne(id: number) {
    try {
      const couponData = await this.prismaService.coupon.findUnique({
        where: { id: id },
      });

      return {
        statusCode: 200,
        message: 'Fetched coupon successfully',
        data: couponData,
      };
    } catch (err: any) {
      console.error('Error while fetching coupon data', err.message);
      throw new InternalServerErrorException('Failed to fetch coupon data');
    }
  }

  async update(id: number, updateCouponDto: UpdateCouponDto) {
    const { code, discount, expiresAt } = updateCouponDto;
    try {
      return this.prismaService.$transaction(async (prisma) => {
        const existingCoupon = await prisma.coupon.findUnique({
          where: { id: id },
        });

        const existingCouponCode = await prisma.coupon.findUnique({
          where: { code: updateCouponDto.code, isActive: true },
        });

        if (existingCoupon && existingCouponCode) {
          throw new BadRequestException(
            'Coupon not found or Code name already exists',
          );
        }

        const couponData = await prisma.coupon.update({
          where: { id: existingCoupon.id },
          data: {
            code,
            discount,
            expiresAt,
          },
        });

        return {
          statusCode: 200,
          message: 'Coupon updated successfully',
          data: couponData,
        };
      });
    } catch (err: any) {
      console.error('Error while updating coupon data', err.message);
      throw new InternalServerErrorException('Failed to update coupon data');
    }
  }

  async softDelete(ids: number[]) {
    try {
      const softDeleteResult = await this.prismaService.coupon.updateMany({
        where: { id: { in: ids }, isDeleted: false },
        data: {
          isDeleted: true,
        },
      });

      if (softDeleteResult.count === 0) {
        throw new BadRequestException(
          'They may not exist or are already deleted.',
        );
      }

      return {
        statusCode: 200,
        message: `${softDeleteResult.count} coupon deleted successfully`,
      };
    } catch (err: any) {
      console.error('Error while deleting coupon', err.message);
      throw new InternalServerErrorException('Failed to delete coupon');
    }
  }

  async findAllSoftDeleted(page: number = 1, limit: number = 10) {
    try {
      const skip = (page - 1) * limit;
      const [couponData, total] = await Promise.all([
        this.prismaService.coupon.findMany({
          where: { isDeleted: true },
          skip,
          take: limit,
        }),
        this.prismaService.coupon.count({ where: { isDeleted: true } }),
      ]);
      return {
        statusCode: 200,
        message: 'Fetched all coupon successfully',
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        data: couponData,
      };
    } catch (error) {
      console.error('Error while fetching data', error.message);
      throw new InternalServerErrorException();
    }
  }

  async restore(ids: number[]) {
    try {
      const restoreResult = await this.prismaService.coupon.updateMany({
        where: { id: { in: ids }, isDeleted: true },
        data: {
          isDeleted: false,
        },
      });
      return {
        statusCode: 200,
        message: `${restoreResult.count} coupon restored successfully`,
      };
    } catch (err: any) {
      console.error('Error while restoring coupon', err.message);
      throw new InternalServerErrorException('Failed to restore coupon');
    }
  }

  async permanentDelete(ids: number[]) {
    try {
      const permanentDeleteResult = await this.prismaService.coupon.deleteMany({
        where: { id: { in: ids }, isDeleted: true },
      });

      return {
        statusCode: 200,
        message: `${permanentDeleteResult.count} coupon deleted successfully`,
      };
    } catch (err: any) {
      console.error('Error while deleting coupon data', err.message);
      throw new InternalServerErrorException('Failed to delete coupon data');
    }
  }

  remove(id: number) {
    return `This action removes a #${id} coupon`;
  }
}
