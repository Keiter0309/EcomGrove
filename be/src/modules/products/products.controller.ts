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
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Request, Response } from 'express';
import { JwtProductGuard } from './jwt-product.guard';
import { RestoreDto } from './dto/restore.dto';
import { SoftDeleteDto } from './dto/soft-delete.dto';
import { PermanentDto } from './dto/permanent.dto';
import { ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { S3Utils } from 'src/utils/s3.util';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/common/configs/multer.config';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards(JwtProductGuard)
  @Post('add-product')
  @ApiOperation({ summary: 'Upload a product with multiple images' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        description: { type: 'string' },
        price: { type: 'number' },
        stock: { type: 'number' },
        categoryId: { type: 'number' },
        imagePath: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
        },
      },
    },
  })
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'imagePath', maxCount: 5 }], multerOptions),
  )
  async create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles() files: { imagePath?: Express.Multer.File[] },
    @Req() req: Request,
    @Res() res: Response,
  ) {
    if (!files || !files.imagePath || files.imagePath.length === 0) {
      throw new BadRequestException('At least one product image is required');
    }

    // Upload all images to S3
    const uploadPromises = files.imagePath.map((file) =>
      S3Utils.uploadToS3({ imagePath: file }, 'product'),
    );

    const uploadedImages = await Promise.all(uploadPromises);
    const imageNames = [
      'Front View',
      'Side View',
      'Back View',
      'Top View',
      'Bottom View',
    ];

    // Store uploaded image URLs in DTO
    createProductDto.imagePath = uploadedImages.map((img, index) => ({
      name: imageNames[index] || `Image ${index + 1}`,
      url: img.url,
    }));

    // (Optional) Save product in database
    const id = (req.user as any).id;
    const response = await this.productsService.create(createProductDto, id);
    return res.status(200).json(response);
  }

  @Get()
  async findAll(@Res() res: Response) {
    const response = await this.productsService.findAll();
    return res.status(200).json(response);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    const response = await this.productsService.findOne(+id);
    if (!response) {
      throw new BadRequestException(`Products with id ${id} not found`);
    }

    return res.status(200).json(response);
  }

  @UseGuards(JwtProductGuard)
  @Patch('update-product/:id')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const userId = (req.user as any).id;
    const response = await this.productsService.update(
      +id,
      updateProductDto,
      userId,
    );

    return res.status(200).json(response);
  }

  @UseGuards(JwtProductGuard)
  @Post('restore-products')
  async restoreProduct(@Body() restoreDto: RestoreDto, @Res() res: Response) {
    if (!restoreDto.ids || restoreDto.ids.length === 0) {
      throw new BadRequestException('No products IDs provided for restoration');
    }
    const response = await this.productsService.restoreProducts(restoreDto.ids);

    return res.status(200).json(response);
  }

  @UseGuards(JwtProductGuard)
  @Delete('soft-delete')
  async softDelete(@Body() sofDeleteDto: SoftDeleteDto, @Res() res: Response) {
    if (!sofDeleteDto.ids || sofDeleteDto.ids.length === 0) {
      throw new BadRequestException('No products IDs provided for deletion');
    }

    const response = await this.productsService.softDeleted(sofDeleteDto.ids);
    return res.status(200).json(response);
  }

  @UseGuards(JwtProductGuard)
  @Get('fetch-all-deleted')
  async fetchAllDeleted(@Res() res: Response) {
    try {
      const response = await this.productsService.findAllSoftDeleted();
      return res.status(200).json(response);
    } catch (error) {
      console.error('Error while fetching data', error.message);
      return res.status(500).json({
        statusCode: 500,
        message: 'Error while fetching data',
      });
    }
  }

  @UseGuards(JwtProductGuard)
  @Delete('delete')
  async remove(@Body() permanentDto: PermanentDto, @Res() res: Response) {
    if (!permanentDto.ids || permanentDto.ids.length === 0) {
      throw new BadRequestException('No products IDs provided for deletion');
    }
    const response = await this.productsService.permanentDelete(
      permanentDto.ids,
    );

    return res.status(200).json(response);
  }
}
