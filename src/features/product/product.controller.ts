import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductDto } from './dto/product.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async getProducts(
    @Query('store_name') storeName: string,
    @Query('page') page: number,
  ) {
    return this.productService.getProducts(storeName, page);
  }

  @Post()
  async createProduct(@Body() createProductDto: ProductDto) {
    return this.productService.createProduct(createProductDto);
  }
  @Get('get-product-by-store')
  async getProductsByStore(
    @Query('store_name') storeName: string,
    @Query('page') page: number,
  ) {
    return this.productService.getProductsByStore(storeName, page);
  }
  @Get(':product_id')
  async getProductById(@Param('product_id') productId: string) {
    return this.productService.getProductById(productId);
  }
  @Post('analyze')
  async analyzeProductsByDate(@Body('store_name') storeName: string) {
    return this.productService.analyzeProductsByDate(storeName);
  }
  @Post('delete')
  async deleteProducts(@Body('product_ids') productIds: string[]) {
    return this.productService.deleteProducts(productIds);
  }
  @Post(':product_id')
  async updateProduct(
    @Param('product_id') productId: string,
    @Body() updateProductDto: ProductDto,
  ) {
    return this.productService.updateProduct(productId, updateProductDto);
  }
}
