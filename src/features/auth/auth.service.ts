import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CreateUserDto,
  LoginDto,
  emailToResetDto,
  confirmCodeDto,
  changePasswordDto,
  resetPasswordDto,
} from './dto/auth.dto';
import { Auth } from './entities/auth.entity';
import { MailService } from '../mail/mail.service';
import { UserProfile } from '../user-profile/entities/user-profile.entity';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class AuthService {
  private usersData: Map<string, { token: string; expiresAt: Date }> =
    new Map();
  constructor(
    @InjectRepository(Auth)
    private repo: Repository<Auth>,
    @InjectRepository(UserProfile)
    private repoUserProfile: Repository<UserProfile>,
    private mailService: MailService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
    setInterval(() => {
      this.cleanupExpiredData();
    }, 600000);
  }

  async saveEmailAndToken(
    email: string,
    token: string,
    expiresInMilliseconds: number,
  ): Promise<void> {
    const expiresAt = new Date();
    expiresAt.setMilliseconds(
      expiresAt.getMilliseconds() + expiresInMilliseconds,
    );

    this.usersData.set(email, { token, expiresAt });
  }
  async authenticateEmailAndToken(
    email: string,
    token: string,
  ): Promise<boolean> {
    const userData = this.usersData.get(email);

    if (!userData || userData.token !== token) {
      return false;
    }
    return true;
  }

  private getValidUsersData(): { [email: string]: string } {
    const validUsersData: { [email: string]: string } = {};

    for (const [email, userData] of this.usersData.entries()) {
      validUsersData[email] = userData.token;
    }

    return validUsersData;
  }

  private cleanupExpiredData() {
    const currentTime = new Date();
    const expiredEmails: string[] = [];

    for (const [email, userData] of this.usersData.entries()) {
      if (userData.expiresAt <= currentTime) {
        expiredEmails.push(email);
      }
    }

    expiredEmails.forEach((email) => {
      this.usersData.delete(email);
    });
  }

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
  async resetPasswordRequest(emailToResetDto: emailToResetDto): Promise<{
    code: number;
    message: string;
  }> {
    const { email } = emailToResetDto;
    const user: Auth = await this.repo.findOne({ where: { email } });

    if (!user) {
      throw new UnauthorizedException('Email is incorrect');
    }
    const token = Math.floor(Math.random() * 1000000)
      .toString()
      .padStart(6, '0');
    const username = user.username;
    await this.saveEmailAndToken(email, token, 300);

    await this.mailService.sendUserResetPassword(email, username, token);

    return {
      code: 200,
      message: 'Request reset successful',
    };
  }
  async resetPasswordConfirm(confirmCodeDto: confirmCodeDto): Promise<{
    code: number;
    message: string;
  }> {
    const { email, token } = confirmCodeDto;

    const isVerified: boolean = await this.authenticateEmailAndToken(
      email,
      token,
    );
    if (!isVerified) {
      throw new UnauthorizedException(
        'The recovery code is incorrect or expired',
      );
    }

    return {
      code: 200,
      message: 'Request reset successful',
    };
  }
  async resetPassword(resetPasswordDto: resetPasswordDto): Promise<{
    code: number;
    message: string;
  }> {
    const { email, token, password } = resetPasswordDto;
    const user: Auth = await this.repo.findOne({ where: { email } });
    const hashedPassword = await bcrypt.hash(password, 10);

    if (!user) {
      throw new UnauthorizedException('Email is incorrect');
    }

    const isVerified: boolean = await this.authenticateEmailAndToken(
      email,
      token,
    );
    if (!isVerified) {
      throw new UnauthorizedException(
        'The recovery code is incorrect or expired',
      );
    }
    user.password = hashedPassword;
    await this.repo.save(user);
    return {
      code: 200,
      message: 'Reset password successful',
    };
  }
  async changePassword(changePasswordDto: changePasswordDto): Promise<{
    code: number;
    message: string;
  }> {
    const { user_id, confirm_password, new_password, password } =
      changePasswordDto;
    const user: Auth = await this.repo.findOne({ where: { user_id } });
    const hashedPassword = await bcrypt.hash(confirm_password, 10);

    const isPasswordMatched = await bcrypt.compare(password, user?.password);
    if (!isPasswordMatched) {
      throw new UnauthorizedException('Invalid password');
    }
    const isPasswordDuplicated = await bcrypt.compare(
      new_password,
      user?.password,
    );
    if (isPasswordDuplicated) {
      throw new UnauthorizedException('New password is duplicated');
    }
    user.password = hashedPassword;
    await this.repo.save(user);
    return {
      code: 200,
      message: 'Change password successful',
    };
  }
}
