import {
  IsNumber,
  IsEmail,
  IsString,
  IsOptional,
  Length,
  IsNotEmpty,
  IsArray,
  ArrayNotEmpty,
} from 'class-validator';

export class ProductDto {
  @IsNotEmpty()
  @IsString()
  store_name: string;

  @IsOptional()
  @IsString()
  product_id: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  imageUrl1: string;

  @IsOptional()
  @IsString()
  imageUrl2: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  priceMain: number;

  @IsNotEmpty()
  @IsString()
  priceSale: number;
}
export class DeleteProductsDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  productIds: string[];
}
