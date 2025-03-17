import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  Res,
  UseGuards,
  Delete,
  Param,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { Request, Response } from 'express';
import { JwtCartGuard } from './jwt-cart.guard';
import { RemoveProductDto } from './dto/remove-product.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @UseGuards(JwtCartGuard)
  @Post('add-to-cart')
  async addToCart(
    @Body() createCartDto: CreateCartDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const email = (req.user as any).email;
    const response = await this.cartService.addToCart(createCartDto, email);

    return res.status(200).json(response);
  }

  @UseGuards(JwtCartGuard)
  @Get()
  async getCart(@Req() req: Request, @Res() res: Response) {
    const email = (req.user as any).email;
    const response = await this.cartService.getCart(email);

    return res.status(200).json(response);
  }

  @UseGuards(JwtCartGuard)
  @Delete(':id')
  async removeProductFromCart(
    @Param('id') id: number,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const email = (req.user as any).email;
    const response = await this.cartService.removeProductFromCart(email, id);

    return res.status(200).json(response);
  }

  @UseGuards(JwtCartGuard)
  @Post('clear-cart')
  async clearCart(@Req() req: Request, @Res() res: Response) {
    const id = (req.user as any).id;

    const response = await this.cartService.clearCart(id);

    return res.status(200).json(response);
  }

  @UseGuards(JwtCartGuard)
  @Post('update-cart')
  async updateCart(
    @Body() updateCartDto: UpdateCartDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const id = (req.user as any).id;
    const response = await this.cartService.updateCartItem(id, updateCartDto);

    return res.status(200).json(response);
  }
}
