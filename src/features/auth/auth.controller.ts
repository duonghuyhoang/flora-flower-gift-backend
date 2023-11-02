import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  CreateUserDto,
  LoginDto,
  emailToResetDto,
  confirmCodeDto,
  resetPasswordDto,
  changePasswordDto,
} from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('user/:id')
  getUser(@Param('id') id: string) {
    return this.authService.getUser(id);
  }
  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  login(@Body() loginUserDto: LoginDto) {
    return this.authService.login(loginUserDto);
  }
  @Post('reset-password-request')
  resetPasswordRequest(@Body() emailToResetDto: emailToResetDto) {
    return this.authService.resetPasswordRequest(emailToResetDto);
  }
  @Post('reset-password-confirm')
  resetPasswordConfirm(@Body() confirmCodeDto: confirmCodeDto) {
    return this.authService.resetPasswordConfirm(confirmCodeDto);
  }
  @Post('reset-password')
  resetPassword(@Body() resetPasswordDto: resetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }
  @Post('change-password')
  changePassword(@Body() changePasswordDto: changePasswordDto) {
    return this.authService.changePassword(changePasswordDto);
  }
}
