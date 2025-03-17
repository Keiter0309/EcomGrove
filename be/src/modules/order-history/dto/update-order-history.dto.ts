import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderHistoryDto } from './create-order-history.dto';

export class UpdateOrderHistoryDto extends PartialType(CreateOrderHistoryDto) {}
