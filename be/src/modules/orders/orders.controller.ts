import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  UseGuards,
  Res,
  Req,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtOrderGuard } from './jwt-order.guard';
import { Response, Request } from 'express';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(JwtOrderGuard)
  @Post()
  async create(@Req() req: Request, @Res() res: Response) {
    try {
      const id = (req.user as any).id;
      const response = await this.ordersService.create(id);
      return res.status(200).json(response);
    } catch (error) {
      console.error('Error creating order:', error);
      return res
        .status(500)
        .json({ message: 'Failed to create order', error: error.message });
    }
  }

  @UseGuards(JwtOrderGuard)
  @Get('fetch-all')
  async findAll(@Req() req: Request, @Res() res: Response) {
    try {
      const id = (req.user as any).id;
      const response = await this.ordersService.findAll(+id);
      return res.status(200).json(response);
    } catch (error) {
      console.error('Error fetching orders:', error);
      return res
        .status(500)
        .json({ message: 'Failed to fetch orders', error: error.message });
    }
  }

  @UseGuards(JwtOrderGuard)
  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const userId = (req.user as any).id;
      const response = await this.ordersService.findOne(+id, userId);
      return res.status(200).json(response);
    } catch (error) {
      console.error('Error fetching order:', error);
      return res
        .status(500)
        .json({ message: 'Failed to fetch order', error: error.message });
    }
  }

  @UseGuards(JwtOrderGuard)
  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const userId = (req.user as any).id;
      const response = await this.ordersService.cancelOrder(+id, userId);
      return res.status(200).json(response);
    } catch (error) {
      console.error('Error cancelling order:', error);
      return res
        .status(500)
        .json({ message: 'Failed to cancel order', error: error.message });
    }
  }
}
