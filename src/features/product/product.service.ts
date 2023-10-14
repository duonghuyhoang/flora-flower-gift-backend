import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { ProductDto } from './dto/product.dto';
import { DeleteProductsDto } from './dto/product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, In, Repository } from 'typeorm';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private repo: Repository<Product>,
  ) {}

  private generateRandomProductId(): string {
    return uuidv4();
  }
  async getProducts(storeName: string, page: number) {
    const perPage = 4;
    const skip = (page - 1) * perPage;

    const [products, totalItems] = await this.repo.findAndCount({
      where: { store_name: storeName },
      skip,
      take: perPage,
    });
    const formattedProducts = products.map((product, index) => ({
      id: index + 1 + skip,
      store_name: product.store_name,
      product: product,
    }));
    const totalPages = Math.ceil(totalItems / perPage);

    return {
      data: formattedProducts,
      totalItems,
      totalPages,
    };
  }

  async createProduct(createProductDto: ProductDto) {
    const {
      store_name,
      description,
      imageUrl1,
      imageUrl2,
      name,
      priceMain,
      priceSale,
    } = createProductDto;

    const newProduct = this.repo.create({
      store_name,
      product_id: this.generateRandomProductId(),
      description,
      image_product1: imageUrl1,
      image_product2: imageUrl2,
      name,
      price_main: priceMain,
      price_sale: priceSale,
    });
    const createdProduct = await this.repo.save(newProduct);

    throw new HttpException('Product created successfully', HttpStatus.OK);
  }

  async getProductById(productId: string) {
    const product = await this.repo.findOne({
      where: { product_id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }
  async getProductsByStore(storeName: string, page: number) {
    const perPage = 12;
    const skip = (page - 1) * perPage;

    const [products, totalItems] = await this.repo.findAndCount({
      where: { store_name: storeName },
      skip,
      take: perPage,
    });

    const totalPages = Math.ceil(totalItems / perPage);

    return {
      data: products,
      totalItems,
      totalPages,
    };
  }
  async analyzeProductsByDate(storeName: string): Promise<any> {
    const startDate = new Date();
    const endDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

    const productsByDate = await this.repo.find({
      where: {
        created_at: Between(startDate, endDate),
        store_name: storeName,
      },
      select: ['created_at'],
    });

    const productStats = [];
    const dateRange = [];
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const formattedDate = currentDate.toISOString().slice(0, 10);
      const count = productsByDate.filter(
        (product) =>
          product.created_at.toISOString().slice(0, 10) === formattedDate,
      ).length;
      productStats.push({
        date: formattedDate,
        product: count,
      });
      dateRange.push(formattedDate);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return { data: productStats };
  }

  async updateProduct(productId: string, updateProductDto: ProductDto) {
    const product = await this.repo.findOne({
      where: { product_id: productId },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    if (updateProductDto.name) {
      product.name = updateProductDto.name;
    }
    if (updateProductDto.description) {
      product.description = updateProductDto.description;
    }
    if (updateProductDto.imageUrl1) {
      product.image_product1 = updateProductDto.imageUrl1;
    }
    if (updateProductDto.imageUrl2) {
      product.image_product2 = updateProductDto.imageUrl2;
    }
    if (updateProductDto.priceMain) {
      product.price_main = updateProductDto.priceMain;
    }
    if (updateProductDto.priceSale) {
      product.price_sale = updateProductDto.priceSale;
    }
    await this.repo.save(product);
    throw new HttpException('Product updated successfully', HttpStatus.OK);
  }

  async deleteProducts(productIds: string[]) {
    if (productIds.length === 0) {
      throw new HttpException(
        'No product_ids provided',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.repo.delete({ product_id: In(productIds) });
    throw new HttpException('Products deleted successfully', HttpStatus.OK);
  }
}
