import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppDataSource } from '../ormconfig';

import { AuthMiddleware } from './common/middlewares/auth.middleware';

import { AuthModule } from './features/auth/auth.module';
import { UserProfileModule } from './features/user-profile/user-profile.module';
import { ProductModule } from './features/product/product.module';
import { MailModule } from './features/mail/mail.module';
import { ExampleModule } from './features/example/example.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async () => {
        await AppDataSource.initialize();
        return AppDataSource.options;
      },
      inject: [ConfigService],
    }),
    MailModule,
    AuthModule,
    UserProfileModule,
    ProductModule,
    ExampleModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
      }),
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude({
        path: 'products/get-product-by-store',
        method: RequestMethod.GET,
      })
      .forRoutes('products');
    consumer.apply(AuthMiddleware).forRoutes('user-profiles');
  }
}
