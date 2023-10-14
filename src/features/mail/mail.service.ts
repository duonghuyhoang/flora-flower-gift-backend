import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(email: string, username: string, token: string) {
    const url = `example.com/auth/confirm?token=${token}`;

    await this.mailerService.sendMail({
      to: email,

      subject: 'Welcome to Nice App! Confirm your Email',
      template: './confirmation',
      context: {
        name: username,
        url,
      },
    });
  }
}
