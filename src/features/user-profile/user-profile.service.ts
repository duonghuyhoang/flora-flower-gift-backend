import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../auth/dto/auth.dto';
import { CreateUserProfileDto } from './dto/user-profile.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserProfile } from './entities/user-profile.entity';
import { Auth } from '../auth/entities/auth.entity';

@Injectable()
export class UserProfileService {
  constructor(
    @InjectRepository(UserProfile)
    private repo: Repository<UserProfile>,
    @InjectRepository(Auth)
    private repoUser: Repository<Auth>,
  ) {}
  async getUserProfile(id: string): Promise<CreateUserProfileDto> {
    const userProfile = await this.repo.findOne({ where: { user_id: id } });

    if (!userProfile) {
      throw new NotFoundException('User profile not found');
    }
    const userProfileDto: CreateUserProfileDto = {
      user_id: userProfile.user_id,
      address: userProfile.address,
      imageUrl: userProfile.avatar,
      city: userProfile.city,
      description: userProfile.description,
      emailcontact: userProfile.emailcontact,
      phoneNumber: userProfile.phone_number,
      nickname: userProfile.nickname,
      state: userProfile.state,
      zipcode: userProfile.zipcode,
    };

    return userProfileDto;
  }

  async updateUserProfile(
    updateUserProfile: CreateUserProfileDto,
  ): Promise<{ message: string; code: number }> {
    const {
      user_id,
      imageUrl,
      emailcontact,
      nickname,
      address,
      city,
      state,
      zipcode,
      description,
      firstname,
      lastname,
      phoneNumber,
      storename,
    } = updateUserProfile;

    const userProfile = await this.repo.findOne({ where: { user_id } });
    const user = await this.repoUser.findOne({ where: { user_id } });
    if (!userProfile) {
      throw new NotFoundException('User profile not found');
    }
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (firstname) {
      user.firstname = firstname;
    }
    if (lastname) {
      user.lastname = lastname;
    }
    if (storename) {
      user.storename = storename;
    }
    if (phoneNumber) {
      userProfile.phone_number = phoneNumber;
    }
    if (imageUrl) {
      userProfile.avatar = imageUrl;
    }
    if (emailcontact) {
      userProfile.emailcontact = emailcontact;
    }
    if (nickname) {
      userProfile.nickname = nickname;
    }
    if (address) {
      userProfile.address = address;
    }
    if (city) {
      userProfile.city = city;
    }
    if (state) {
      userProfile.state = state;
    }
    if (zipcode) {
      userProfile.zipcode = zipcode;
    }
    if (description) {
      userProfile.description = description;
    }

    await this.repo.save(userProfile);
    await this.repoUser.save(user);
    return {
      message: 'User profile successfully ',
      code: 200,
    };
  }
}
