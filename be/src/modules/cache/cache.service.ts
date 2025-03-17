import { Inject, Injectable } from '@nestjs/common';
import { CreateCacheDto } from './dto/create-cache.dto';
import { UpdateCacheDto } from './dto/update-cache.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}
  async getCache(key: string): Promise<string | null> {
    return await this.cacheManager.get(key);
  }

  async setCache(key: string, value: string, ttl = 60): Promise<void> {
    await this.cacheManager.set(key, value, ttl * 1000);
  }

  async deleteCache(key: string): Promise<void> {
    await this.cacheManager.del(key);
  }
}
