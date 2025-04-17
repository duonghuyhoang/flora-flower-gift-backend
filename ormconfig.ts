import * as dotenv from 'dotenv';
import * as path from 'path';
import { DataSource } from 'typeorm';
import { Auth } from 'src/features/auth/entities/auth.entity';
import { Product } from 'src/features/product/entities/product.entity';
import { UserProfile } from 'src/features/user-profile/entities/user-profile.entity';
import { ExampleTable } from 'src/features/example/entities/example.entity';

const envPath = path.resolve(
  __dirname,
  `../.env.${process.env.NODE_ENV || 'development'}`,
);
dotenv.config({ path: envPath });

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'flora-flower-gift',
  entities: [Auth, UserProfile, Product, ExampleTable],
  migrations: ['src/database/migrations/*.ts'],
  synchronize: false,
  logging: true,
});

// switch (process.env.NODE_ENV) {
//   case 'development':
//     Object.assign(dbConfig, {
//       entities: [Auth, UserProfile, Product],
//       migrations: ['src/database/migrations/*.ts'],
//       // seeds: ['src/database/seeders/**/*{.ts,.js}'],
//       // factories: ['src/database/factories/**/*{.ts,.js}'],
//       synchronize: false,
//       cli: {
//         migrationsDir: 'src/database/migrations',
//       },
//     });
//     break;
//   case 'production':
//     Object.assign(dbConfig, {
//       entities: [
//         'dist/src/modules/**/*.entity.js',
//         'dist/src/features/**/*.entity.js',
//       ],
//       // migrations: ['dist/src/database/migrations/*.js'],
//       // seeds: ['dist/src/database/seeders/**/*.js'],
//       // factories: ['dist/src/database/factories/**/*.js'],
//       synchronize: false,
//       cli: {
//         migrationsDir: 'dist/src/database/migrations',
//       },
//     });
//     break;
//   default:
//     throw new Error('unknown environment');
// }
