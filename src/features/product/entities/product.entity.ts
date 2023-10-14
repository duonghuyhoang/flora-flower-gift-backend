import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  store_name: string;

  @Column({ unique: true })
  product_id: string;

  @Column()
  name: string;

  @Column('text')
  image_product1: string;

  @Column('text')
  image_product2: string;

  @Column('text')
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price_main: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price_sale: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
