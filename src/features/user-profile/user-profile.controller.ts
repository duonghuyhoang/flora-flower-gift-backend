import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserProfileService } from './user-profile.service';
import { CreateUserProfileDto } from './dto/user-profile.dto';

@Controller('user-profiles')
export class UserProfileController {
  constructor(private readonly userProfileService: UserProfileService) {}

  @Get(':id')
  async getUserProfile(@Param('id') id: string) {
    return this.userProfileService.getUserProfile(id);
  }
  @Post()
  async updateUserProfile(@Body() updateUserProfile: CreateUserProfileDto) {
    return this.userProfileService.updateUserProfile(updateUserProfile);
  }
}
