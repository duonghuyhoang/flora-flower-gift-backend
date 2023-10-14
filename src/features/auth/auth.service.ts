import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto, LoginDto } from './dto/auth.dto';
import { Auth } from './entities/auth.entity';
import { MailService } from '../mail/mail.service';
import { UserProfile } from '../user-profile/entities/user-profile.entity';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth)
    private repo: Repository<Auth>,
    @InjectRepository(UserProfile)
    private repoUserProfile: Repository<UserProfile>,
    private mailService: MailService,
  ) {}

  async getUser(user_id: string): Promise<Auth> {
    const user: Auth = await this.repo.findOne({
      where: { user_id },
      select: ['firstname', 'lastname', 'username', 'storename'],
    });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }

  async register(createUserDto: CreateUserDto): Promise<{ message: string }> {
    const { firstname, lastname, username, email, password, storename } =
      createUserDto;

    const isUsernameTaken = await this.repo.findOne({ where: { username } });
    const isEmailTaken = await this.repo.findOne({ where: { email } });

    if (isUsernameTaken) {
      throw new UnauthorizedException('Username is already taken');
    }

    if (isEmailTaken) {
      throw new UnauthorizedException('Email is already taken');
    }
    const user_id = uuidv4();
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.repo.create({
      user_id,
      firstname,
      lastname,
      username,
      email,
      storename,
      password: hashedPassword,
    });
    await this.repo.save(user);

    const userProfile = await this.repoUserProfile.create({
      user_id,
      avatar: null,
      emailcontact: null,
      nickname: null,
      address: null,
      state: null,
      city: null,
      zipcode: null,
      description: null,
    });
    await this.repoUserProfile.save(userProfile);

    const token = Math.floor(1000 + Math.random() * 9000).toString();

    await this.mailService.sendUserConfirmation(email, username, token);

    throw new HttpException('User registered successfully', HttpStatus.OK);
  }

  async login(loginDto: LoginDto): Promise<{
    code: number;
    message: string;
    access_token: string;
    token_type: string;
    current_user: string;
    store_name: string;
    user_id: string;
  }> {
    const { email, password } = loginDto;
    const user: Auth = await this.repo.findOne({ where: { email } });

    const isPasswordMatched = await bcrypt.compare(password, user?.password);
    if (!user || !isPasswordMatched) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const access_token = jwt.sign({ email }, process.env.JWT_SECRET);
    const token_type = 'Bearer';
    const current_user = user.username;
    const store_name = user.storename;
    const user_id = user.user_id;

    return {
      code: 200,
      message: 'Login successful',
      access_token,
      token_type,
      current_user,
      store_name,
      user_id,
    };
  }
}
