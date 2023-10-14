import {
  IsNumber,
  IsEmail,
  IsString,
  IsNotEmpty,
  IsOptional,
  Length,
} from 'class-validator';

export class CreateUserProfileDto {
  @IsNotEmpty()
  @IsString()
  user_id: string;

  @IsOptional()
  @IsString()
  firstname?: string;

  @IsOptional()
  @IsString()
  lastname?: string;

  @IsOptional()
  @IsString()
  storename?: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  imageUrl?: string;

  @IsOptional()
  avatar?: string;

  @IsOptional()
  @IsEmail()
  emailcontact?: string;

  @IsOptional()
  @IsString()
  nickname?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  zipcode?: string;

  @IsOptional()
  @Length(0, 1000)
  description?: string;
}
