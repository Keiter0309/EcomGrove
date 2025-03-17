import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { PrismaService } from 'src/database/prisma/prisma.service';

@Injectable()
export class AddressService {
  constructor(private readonly prismaService: PrismaService) { }
  async create(createAddressDto: CreateAddressDto, userId: number) {
    const { houseNumber, street, ward, city, district, country, isPrimary } =
      createAddressDto;

    try {
      if (isPrimary) {
        const existingPrimaryAddress =
          await this.prismaService.address.findFirst({
            where: { userId: userId, isPrimary: true },
          });

        if (existingPrimaryAddress) {
          return {
            statusCode: 400,
            success: false,
            message: 'You already have a primary address.'
          }
        }
      }

      // Create the new address
      const newAddress = await this.prismaService.address.create({
        data: {
          houseNumber,
          street,
          ward,
          city,
          district,
          country,
          isPrimary,
          userId: userId,
        },
      });

      return {
        statusCode: 201,
        message: 'Address added successfully',
        data: newAddress,
      };
    } catch (err: any) {
      console.error('Error while adding address', err.message);
      throw new InternalServerErrorException('Failed to add address');
    }
  }

  async findAll() {
    try {
      const addressData = await this.prismaService.address.findMany({
        include: { user: true },
      });

      return {
        statusCode: 200,
        success: true,
        message: 'Fetched address successfully',
        data: addressData,
      };
    } catch (err: any) {
      console.error('Error while fetching all address data', err.message);
      throw new InternalServerErrorException('Failed to fetch address data');
    }
  }

  async update(id: number, updateAddressDto: UpdateAddressDto) {
    const { houseNumber, street, ward, city, district, country, isPrimary } =
      updateAddressDto;

    try {
      if (isPrimary) {
        const existingPrimaryAddress =
          await this.prismaService.address.findFirst({
            where: { userId: id, isPrimary: true },
          });

        if (existingPrimaryAddress) {
          throw new BadRequestException('You already have a primary address.');
        }
      }

      const updatedAddress = await this.prismaService.address.update({
        where: { id: id },
        data: {
          houseNumber,
          street,
          ward,
          city,
          district,
          country,
          isPrimary,
        },
      });

      return {
        statusCode: 200,
        message: 'Address updated successfully',
        data: updatedAddress,
      };
    } catch (err: any) {
      console.error('Error while updating address', err.message);
      throw new InternalServerErrorException('Failed to update address');
    }
  }
}
