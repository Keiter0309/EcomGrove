import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { RemoveProductDto } from './dto/remove-product.dto';

@Injectable()
export class CartService {
  constructor(private readonly prismaService: PrismaService) {}
  async addToCart(createCartDto: CreateCartDto, userEmail: string) {
    const existingUser = await this.prismaService.user.findUnique({
      where: { email: userEmail },
    });
    const userId = existingUser.id;
    const { productId, quantity } = createCartDto;
    try {
      const product = await this.prismaService.product.findUnique({
        where: { id: productId },
      });

      if (!product) {
        throw new NotFoundException('Product not found');
      }

      if (product.stock < quantity) {
        throw new BadRequestException('Not enough stock available');
      }

      const existngCartItem = await this.prismaService.cart.findFirst({
        where: { userId, productId },
      });
      if (existngCartItem) {
        return await this.prismaService.$transaction(async (prisma) => {
          await prisma.cart.update({
            where: { id: existngCartItem.id },
            data: {
              quantity: existngCartItem.quantity + quantity,
            },
          });
          await prisma.product.update({
            where: { id: productId },
            data: {
              stock: { decrement: quantity },
            },
          });
        });
      }

      return await this.prismaService.$transaction(async (prisma) => {
        const cartItemData = await prisma.cart.create({
          data: {
            productId,
            userId,
            quantity,
          },
        });

        await prisma.product.update({
          where: { id: productId },
          data: {
            stock: { decrement: quantity },
          },
        });

        return {
          statusCode: 201,
          message: 'Product added to cart successfully',
          data: cartItemData,
        };
      });
    } catch (err: any) {
      console.error('Error adding to cart:', err.message);
      throw new InternalServerErrorException('Failed to add product to cart');
    }
  }

  async getCart(email: string) {
    const existingUser = await this.prismaService.user.findUnique({
      where: { email: email },
    });
    const userId = existingUser.id;
    try {
      const cartData = await this.prismaService.cart.findMany({
        where: { userId: userId },
        include: {
          product: true,
          user: true,
        },
      });

      return {
        statusCode: 200,
        message: 'Fetched all cart successfully',
        data: cartData,
      };
    } catch (err: any) {
      console.error('Error while getting cart', err.message);
      throw new InternalServerErrorException('Failed to get all cart');
    }
  }

  async removeProductFromCart(email: string, id: number) {
    const existingUser = await this.prismaService.user.findUnique({
      where: { email: email },
    });
    const userId = existingUser.id;
    try {
      const cartItem = await this.prismaService.cart.findUnique({
        where: { id: id },
        include: { product: true },
      });

      if (!cartItem || cartItem.userId !== userId) {
        throw new NotFoundException('Cart item not found');
      }

      return this.prismaService.$transaction(async (prisma) => {
        await prisma.cart.delete({
          where: { id: cartItem.id },
        });

        await prisma.product.update({
          where: { id: cartItem.productId },
          data: {
            stock: cartItem.product.stock + cartItem.quantity,
          },
        });
        return {
          statusCode: 200,
          message: 'Cart item deleted successfully',
        };
      });
    } catch (err: any) {
      console.error('Error while removing product', err.message);
      throw new InternalServerErrorException(
        'Failed to remove product from cart',
      );
    }
  }

  async clearCart(userId: number) {
    try {
      return this.prismaService.$transaction(async (prisma) => {
        const cartData = await prisma.cart.findMany({
          where: { id: userId },
          include: { product: true },
        });

        if (cartData.length === 0) {
          return {
            statusCode: 404,
            message: 'No items in the cart to clear',
          };
        }
        await prisma.cart.deleteMany({
          where: { id: userId },
        });

        await prisma.product.updateMany({
          where: { id: { in: cartData.map((item) => item.productId) } },
          data: {
            stock: {
              increment: cartData.reduce((acc, item) => acc + item.quantity, 0),
            },
          },
        });
        return {
          statusCode: 200,
          message: 'Cart cleared successfully',
        };
      });
    } catch (err: any) {
      console.error('Error while clearing cart', err.message);
      throw new InternalServerErrorException('Failed to clearing cart');
    }
  }

  async updateCartItem(userId: number, updateCartDto: UpdateCartDto) {
    const cartItem = await this.prismaService.cart.findUnique({
      where: { id: updateCartDto.cartItemId },
    });

    if (!cartItem || cartItem.userId !== userId) {
      throw new NotFoundException('Cart item not found');
    }

    return this.prismaService.$transaction(async (prisma) => {
      if (updateCartDto.quantity <= 0) {
        await prisma.cart.delete({
          where: { id: updateCartDto.cartItemId },
        });

        await prisma.product.update({
          where: { id: cartItem.productId },
          data: {
            stock: {
              increment: updateCartDto.quantity + cartItem.quantity,
            },
          },
        });

        return {
          statusCode: 200,
          message: 'Cart item removed due to zero quantity',
        };
      }

      const updatedCartItem = await prisma.cart.update({
        where: { id: updateCartDto.cartItemId },
        data: {
          quantity: updateCartDto.quantity,
        },
      });

      await prisma.product.update({
        where: { id: cartItem.productId },
        data: {
          stock: {
            decrement: updateCartDto.quantity - cartItem.quantity,
          },
        },
      });

      return {
        statusCode: 200,
        message: 'Cart item quantity updated successfully',
        data: updatedCartItem,
      };
    });
  }
}
