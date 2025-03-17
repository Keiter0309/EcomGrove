import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CacheService } from './cache.service';
import { CreateCacheDto } from './dto/create-cache.dto';
import { UpdateCacheDto } from './dto/update-cache.dto';

@Controller('cache')
export class CacheController {
  constructor(private readonly cacheService: CacheService) {}

  @Get('set/:key/:value')
  async setCache(@Param('key') key: string, @Param('value') value: string) {
    await this.cacheService.setCache(key, value);
    return { message: `Key has been saved to Redis with value ${value}` };
  }

  @Get('get/:key')
  async getCache(@Param('key') key: string) {
    const value = await this.cacheService.getCache(key);
    return { key, value };
  }

  @Get('delete/:key')
  async deleteCache(@Param('key') key: string) {
    await this.cacheService.deleteCache(key);
    return { message: `Đã xóa ${key} khỏi Redis` };
  }
}
