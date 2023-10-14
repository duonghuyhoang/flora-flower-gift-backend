import * as dotenv from 'dotenv';
import * as path from 'path';
import { Auth } from 'src/features/auth/entities/auth.entity';
import { Product } from 'src/features/product/entities/product.entity';
import { UserProfile } from 'src/features/user-profile/entities/user-profile.entity';

const envPath = path.resolve(__dirname, `../.env.${process.env.NODE_ENV}`);
dotenv.config({ path: envPath });
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';

export const dbConfig: MysqlConnectionOptions = {
  type: 'mysql',
  logging: true,
  synchronize: true,
  database: process.env.DB_DATABASE,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
};

switch (process.env.NODE_ENV) {
  case 'development':
    Object.assign(dbConfig, {
      entities: [Auth, UserProfile, Product],
      migrations: ['src/database/migrations/*.ts'],
      // seeds: ['src/database/seeders/**/*{.ts,.js}'],
      // factories: ['src/database/factories/**/*{.ts,.js}'],
      synchronize: true,
      cli: {
        migrationsDir: 'src/database/migrations',
      },
    });
    break;
  case 'production':
    Object.assign(dbConfig, {
      entities: [
        'dist/src/modules/**/*.entity.js',
        'dist/src/features/**/*.entity.js',
      ],
      // migrations: ['dist/src/database/migrations/*.js'],
      // seeds: ['dist/src/database/seeders/**/*.js'],
      // factories: ['dist/src/database/factories/**/*.js'],
      synchronize: false,
      cli: {
        migrationsDir: 'dist/src/database/migrations',
      },
    });
    break;
  default:
    throw new Error('unknown environment');
}
