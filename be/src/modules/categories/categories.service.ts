import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/database/prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto, userId: number) {
    const { name, description } = createCategoryDto;

    const existingCategory = await this.prismaService.categories.findUnique({
      where: { name },
    });

    if (existingCategory) {
      throw new ConflictException('Category name already exists');
    }

    try {
      const categoriesData = await this.prismaService.categories.create({
        data: {
          name,
          description,
          userId,
          isDeleted: false,
        },
      });

      return {
        statusCode: 201,
        message: 'Category created successfully',
        data: categoriesData,
      };
    } catch (err) {
      console.error('Error while creating category', err.message);
      throw new InternalServerErrorException('Failed to create category');
    }
  }

  async findAll(page: number = 1, limit: number = 10) {
    try {
      const skip = (page - 1) * limit;
      const [categoriesData, total] = await Promise.all([
        this.prismaService.categories.findMany({
          where: { isDeleted: false },
          skip,
          take: limit,
        }),
        this.prismaService.categories.count({ where: { isDeleted: false } }),
      ]);
      return {
        statusCode: 200,
        message: 'Fetched all categories successfully',
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        data: categoriesData,
      };
    } catch (error) {
      console.error('Error while fetching data', error.message);
      throw new InternalServerErrorException();
    }
  }

  async findOne(id: number) {
    const categoriesData = await this.prismaService.categories.findUnique({
      where: { id },
    });

    if (!categoriesData) {
      throw new NotFoundException('Category not found');
    }

    return {
      statusCode: 200,
      message: 'Fetched categories successfully',
      data: categoriesData,
    };
  }

  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
    userId: number,
  ) {
    const { name, description } = updateCategoryDto;

    const existingCategory = await this.prismaService.categories.findFirst({
      where: {
        name,
        NOT: { id },
      },
    });

    if (existingCategory) {
      throw new ConflictException('Category name already exists');
    }

    try {
      const categoriesData = await this.prismaService.categories.update({
        where: { id },
        data: { name, description, userId },
      });

      return {
        statusCode: 200,
        message: 'Category updated successfully',
        data: categoriesData,
      };
    } catch (err) {
      console.error('Error while updating category', err.message);
      throw new InternalServerErrorException('Failed to update category');
    }
  }

  async restoreCategories(ids: number[]) {
    try {
      const restoredCategories = await this.prismaService.categories.updateMany(
        {
          where: { id: { in: ids }, isDeleted: true },
          data: {
            isDeleted: false,
          },
        },
      );

      if (restoredCategories.count === 0) {
        throw new BadRequestException('No categories were restored');
      }
      return {
        statusCode: 200,
        message: `${restoredCategories.count} categories restored successfully`,
      };
    } catch (err) {
      console.error('Error while restoring category', err.message);
      throw new InternalServerErrorException('Failed to restore category');
    }
  }

  async softDelete(ids: number[]) {
    try {
      const softDeleteResult = await this.prismaService.categories.updateMany({
        where: { id: { in: ids }, isDeleted: false },
        data: { isDeleted: true },
      });

      if (softDeleteResult.count === 0) {
        throw new BadRequestException(
          'They may not exist or are already deleted.',
        );
      }

      return {
        statusCode: 200,
        message: `${softDeleteResult.count} categories deleted successfully`,
      };
    } catch (err: any) {
      console.error(
        `Error while deleting categories [IDs: ${ids.join(', ')}]:`,
        err.message,
      );
      throw new InternalServerErrorException('Failed to delete categories');
    }
  }

  async findAllSoftDeleted(page: number = 1, limit: number = 10) {
    try {
      const skip = (page - 1) * limit;
      const [categoriesData, total] = await Promise.all([
        this.prismaService.categories.findMany({
          where: { isDeleted: true },
          skip,
          take: limit,
        }),
        this.prismaService.categories.count({ where: { isDeleted: true } }),
      ]);
      return {
        statusCode: 200,
        message: 'Fetched categories successfully',
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        data: categoriesData,
      };
    } catch (error) {
      console.error('Error while fetching data', error.message);
      throw new InternalServerErrorException();
    }
  }

  async permanentDelete(ids: number[]) {
    try {
      const deleteResult = await this.prismaService.categories.deleteMany({
        where: { id: { in: ids }, isDeleted: true },
      });

      return {
        statusCode: 200,
        message: `${deleteResult.count} categories deleted.`,
      };
    } catch (err: any) {
      console.error(
        `Error while deleting categories [IDs: ${ids.join(', ')}]:`,
        err.message,
      );
      throw new InternalServerErrorException('Failed to delete categories');
    }
  }
}
