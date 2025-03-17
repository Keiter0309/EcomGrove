import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/database/prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private readonly prismaService: PrismaService) { }
  async create(createProductDto: CreateProductDto, userId: number) {
    const { name, description, price, stock, imagePath, categoryId } =
      createProductDto;
    try {
      const productData = await this.prismaService.product.create({
        data: {
          name,
          description,
          price,
          stock,
          imagePath: JSON.stringify(imagePath),
          categoryId,
          userId,
        },
      });

      return {
        statusCode: 201,
        message: 'Created product successfully',
        data: productData,
      };
    } catch (err: any) {
      console.error(`Error while creating product ${err.message}`);
      throw new BadRequestException('Error while creating product');
    }
  }

  async findAll(page: number = 1, limit: number = 10) {
    try {
      const skip = (page - 1) * limit;

      const [productData, total] = await Promise.all([
        this.prismaService.product.findMany({
          where: { isDeleted: false },
          skip,
          take: limit,
        }),
        this.prismaService.product.count({ where: { isDeleted: false } }),
      ]);

      return {
        statusCode: 200,
        message: 'Fetched products successfully',
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        data: productData,
      };
    } catch (err: any) {
      console.error('Error while fetching product data', err.message);
      throw new BadRequestException('Error while fetching product data');
    }
  }

  async findOne(id: number) {
    try {
      const productData = await this.prismaService.product.findUnique({
        where: { id },
      });

      if (!productData) {
        throw new NotFoundException('Product not found');
      }

      return {
        statusCode: 200,
        message: 'Fetched product successfully',
        data: productData,
      };
    } catch (err: any) {
      console.error('Error while fetching product data', err.message);
      throw new BadRequestException('Error while fetching product data');
    }
  }

  async update(id: number, updateProductDto: UpdateProductDto, userId: number) {
    const { name, description, price, stock, imagePath } = updateProductDto;
    const imagePaths = imagePath.map(file => file.url)
    try {
      const productData = await this.prismaService.product.update({
        where: { id },
        data: {
          name,
          description,
          price,
          stock,
          imagePath: imagePaths.join(','),
          userId,
        },
      });

      return {
        statusCode: 200,
        message: 'Updated product successfully',
        data: productData,
      };
    } catch (err: any) {
      console.error('Error while updating product', err.message);
      throw new BadRequestException('Failed to update products');
    }
  }

  async restoreProducts(ids: number[]) {
    try {
      const productData = await this.prismaService.product.updateMany({
        where: { id: { in: ids } },
        data: {
          isDeleted: false,
        },
      });

      if (productData.count === 0) {
        throw new BadRequestException('No products were stored');
      }

      return {
        statusCode: 200,
        message: `${productData.count} products restored successfully`,
      };
    } catch (err: any) {
      console.error('Error while restoring product', err.message);
      throw new BadRequestException('Failed to restore products');
    }
  }

  async softDeleted(ids: number[]) {
    try {
      const softDeleteResult = await this.prismaService.product.updateMany({
        where: { id: { in: ids }, isDeleted: false },
        data: {
          isDeleted: true,
        },
      });

      if (softDeleteResult.count === 0) {
        throw new BadRequestException(
          'They may not exist or are already deleted',
        );
      }
      return {
        statusCode: 200,
        message: `${softDeleteResult.count} products deleted successfully`,
      };
    } catch (err: any) {
      console.error('Error while delete product', err.message);
      throw new InternalServerErrorException('Failed to delete products');
    }
  }

  async findAllSoftDeleted(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    try {
      const [productData, total] = await Promise.all([
        this.prismaService.product.findMany({
          where: { isDeleted: true },
          skip,
          take: limit,
        }),
        this.prismaService.product.count({ where: { isDeleted: true } }),
      ]);

      return {
        statusCode: 200,
        message: 'Fetched products successfully',
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        data: productData,
      };
    } catch (error) {
      console.error('Error while fetching data', error.message);
      throw new InternalServerErrorException();
    }
  }

  async permanentDelete(ids: number[]) {
    try {
      const deleteResult = await this.prismaService.product.deleteMany({
        where: { id: { in: ids }, isDeleted: true },
      });

      return {
        statusCode: 200,
        message: `${deleteResult.count} products deleted`,
      };
    } catch (err: any) {
      console.error('Error while deleting products', err.message);
      throw new InternalServerErrorException('Failed to delete products');
    }
  }
}
