import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Res,
  BadRequestException,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Request, Response } from 'express';
import { JwtCategoriesGuard } from './jwt-categories.guard';
import { PermanentDto } from './dto/permanent.dto';
import { SoftDeleteDto } from './dto/soft-delete.dto';
import { RestoreDto } from './dto/restore.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @UseGuards(JwtCategoriesGuard)
  @Post('add-category')
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const userId = (req.user as any)?.id;
    const response = await this.categoriesService.create(
      createCategoryDto,
      userId,
    );
    return res.status(201).json(response);
  }

  @Get('fetch-all')
  async findAll(@Res() res: Response) {
    const response = await this.categoriesService.findAll();
    return res.status(200).json(response);
  }

  @UseGuards(JwtCategoriesGuard)
  @Get('fetch-all-deleted')
  async fetchAllDeleted(@Res() res: Response) {
    try {
      const response = await this.categoriesService.findAllSoftDeleted();

      return res.status(200).json(response);
    } catch (error) {
      console.error('Error while fetching data');
      return res.status(500).json({
        statuCode: 500,
        message: 'Error while fetching data',
      });
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    const response = await this.categoriesService.findOne(+id);
    if (!response) {
      throw new BadRequestException(`Category with ID ${id} not found.`);
    }

    return res.status(200).json(response);
  }

  @UseGuards(JwtCategoriesGuard)
  @Patch('update-category/:id')
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const userId = (req.user as any).id;
    const response = await this.categoriesService.update(
      +id,
      updateCategoryDto,
      userId,
    );
    return res.status(200).json(response);
  }

  @UseGuards(JwtCategoriesGuard)
  @Post('restore-categories')
  async restore(@Body() restoreDto: RestoreDto, @Res() res: Response) {
    if (!restoreDto.ids || restoreDto.ids.length === 0) {
      throw new BadRequestException(
        'No category IDs provided for restoration.',
      );
    }

    const response = await this.categoriesService.restoreCategories(
      restoreDto.ids,
    );
    return res.status(200).json(response);
  }

  @UseGuards(JwtCategoriesGuard)
  @Delete('soft-delete')
  async softDelete(@Body() softDeleteDto: SoftDeleteDto, @Res() res: Response) {
    if (!softDeleteDto.ids || softDeleteDto.ids.length === 0) {
      throw new BadRequestException(
        'No category IDs provided for soft deletion.',
      );
    }

    const response = await this.categoriesService.softDelete(softDeleteDto.ids);
    return res.status(200).json(response);
  }

  @UseGuards(JwtCategoriesGuard)
  @Delete('delete')
  async remove(@Body() permanentDto: PermanentDto, @Res() res: Response) {
    if (!permanentDto.ids || permanentDto.ids.length === 0) {
      throw new BadRequestException(
        'No category IDs provided for permanent deletion.',
      );
    }

    const response = await this.categoriesService.permanentDelete(
      permanentDto.ids,
    );
    return res.status(200).json(response);
  }
}
