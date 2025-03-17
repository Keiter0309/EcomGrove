import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OrderHistoryService } from './order-history.service';
import { CreateOrderHistoryDto } from './dto/create-order-history.dto';
import { UpdateOrderHistoryDto } from './dto/update-order-history.dto';

@Controller('order-history')
export class OrderHistoryController {
  constructor(private readonly orderHistoryService: OrderHistoryService) {}

  @Post()
  create(@Body() createOrderHistoryDto: CreateOrderHistoryDto) {
    return this.orderHistoryService.create(createOrderHistoryDto);
  }

  @Get()
  findAll() {
    return this.orderHistoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderHistoryService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderHistoryDto: UpdateOrderHistoryDto) {
    return this.orderHistoryService.update(+id, updateOrderHistoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderHistoryService.remove(+id);
  }
}
