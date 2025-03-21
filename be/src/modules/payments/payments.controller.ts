import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('capture/:orderId')
  @HttpCode(200)
  async capturePayment(@Param('orderId') orderId: string) {
    return await this.paymentsService.captureOrder(orderId);
  }

  @Post('details/:orderId')
  @HttpCode(200)
  async getOrderDetails(@Param('orderId') orderId: string) {
    return await this.getOrderDetails(orderId);
  }
}
