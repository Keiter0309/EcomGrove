import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from 'src/database/prisma/prisma.service';

@Injectable()
export class OrdersService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(id: number) {
    try {
      return await this.prismaService.$transaction(async (prisma) => {
        const cartItems = await prisma.cart.findMany({
          where: { userId: id },
          include: {
            product: true,
            user: true,
          },
        });

        if (cartItems.length === 0) {
          throw new NotFoundException('Cart is empty for the user');
        }

        const orders = [];

        for (const cartItem of cartItems) {
          const productData = await prisma.product.findUnique({
            where: { id: cartItem.productId },
          });

          if (!productData) {
            throw new NotFoundException(
              `Product with ID ${cartItem.productId} not found`,
            );
          }

          const totalAmount = productData.price.toNumber() * cartItem.quantity;

          const order = await prisma.order.create({
            data: {
              quantity: cartItem.quantity,
              productId: cartItem.productId,
              totalAmount,
              userId: cartItem.user.id,
            },
          });

          await prisma.product.update({
            where: { id: cartItem.productId },
            data: {
              stock: {
                decrement: cartItem.quantity,
              },
            },
          });

          orders.push(order);
        }

        await prisma.cart.deleteMany({
          where: { userId: id },
        });

        return {
          statusCode: 200,
          message: 'Orders created successfully',
          data: orders,
        };
      });
    } catch (err: any) {
      console.error('Error while creating new orders:', err);
      throw new InternalServerErrorException('Failed to create orders');
    }
  }

  async findAll(id: number, page: number = 1, limit: number = 10) {
    try {
      const skip = (page - 1) * limit;
      const [orderData, total] = await Promise.all([
        this.prismaService.order.findMany({
          where: { id: id },
          skip,
          take: limit,
        }),
        this.prismaService.order.count(),
      ]);

      return {
        statusCode: 200,
        message: 'Fetched order data successfully',
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        data: orderData,
      };
    } catch (err: any) {
      console.error('Error while fetching all orders data', err.message);
      throw new InternalServerErrorException('Failed to fetch all orders data');
    }
  }

  async findOne(orderId: number, userId: number) {
    try {
      const order = await this.prismaService.order.findFirst({
        where: { id: orderId, userId },
      });

      if (!order) {
        throw new NotFoundException('Order not found');
      }

      return {
        statusCode: 200,
        message: 'Fetched order successfully',
        data: order,
      };
    } catch (err: any) {
      console.error('Error while fetching the order', err.message);
      throw new InternalServerErrorException('Failed to fetch the order');
    }
  }

  async cancelOrder(orderId: number, userId: number) {
    const order = await this.prismaService.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.userId !== userId) {
      throw new ForbiddenException('You are not allowed to cancel this order');
    }

    if (order.status === 'SHIPPED') {
      throw new BadRequestException(
        'Cannot cancel an order that has already been shipped',
      );
    }

    const canceledOrder = await this.prismaService.order.update({
      where: { id: orderId },
      data: { status: 'CANCELLED' },
    });

    return {
      statusCode: 200,
      message: 'Order cancelled successfully',
      data: canceledOrder,
    };
  }
}
