import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { AuthController } from './auth.controller';
import { MailModule } from '../mail/mail.module';
import { Auth } from './entities/auth.entity';
import { MailService } from '../mail/mail.service';
import { UserProfile } from '../user-profile/entities/user-profile.entity';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    TypeOrmModule.forFeature([Auth, UserProfile]),
    MailModule,
    CacheModule.register({}),
  ],
  controllers: [AuthController],
  providers: [AuthService, MailService],
})
export class AuthModule {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}
}
