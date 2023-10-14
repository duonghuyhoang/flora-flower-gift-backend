import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { MailModule } from '../mail/mail.module';
import { Auth } from './entities/auth.entity';
import { UserProfile } from '../user-profile/entities/user-profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Auth, UserProfile]), MailModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
