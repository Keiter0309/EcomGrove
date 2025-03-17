import { Injectable } from '@nestjs/common';
import { CreateOrderHistoryDto } from './dto/create-order-history.dto';
import { UpdateOrderHistoryDto } from './dto/update-order-history.dto';

@Injectable()
export class OrderHistoryService {
  create(createOrderHistoryDto: CreateOrderHistoryDto) {
    return 'This action adds a new orderHistory';
  }

  findAll() {
    return `This action returns all orderHistory`;
  }

  findOne(id: number) {
    return `This action returns a #${id} orderHistory`;
  }

  update(id: number, updateOrderHistoryDto: UpdateOrderHistoryDto) {
    return `This action updates a #${id} orderHistory`;
  }

  remove(id: number) {
    return `This action removes a #${id} orderHistory`;
  }
}
