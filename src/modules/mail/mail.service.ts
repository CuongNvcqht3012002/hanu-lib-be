import { MailerService } from '@nestjs-modules/mailer'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { IMailData } from 'modules/mail/interfaces/mail-data.interface'

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService, private configService: ConfigService) {}

  async verifyEmail(
    mailData: IMailData<{ verifyEmailToken: string; email: string; fullName: string }>
  ) {
    await this.mailerService.sendMail({
      to: mailData.to,
      subject: 'Xác nhận Email',
      template: 'confirm-email',
      context: {
        title: 'Xác nhận Email',
        logo: `${this.configService.get('app.backendDomain')}/images/logo-hanu.png`,
        url: `${this.configService.get('app.frontendDomain')}/auth/confirm-email/${
          mailData.data.verifyEmailToken
        }`,
        year: new Date().getFullYear(),
      },
    })
  }

  async forgotPassword(mailData: IMailData<{ forgotPasswordToken: string }>) {
    await this.mailerService.sendMail({
      to: mailData.to,
      subject: 'Yêu cầu đặt lại mật khẩu',
      template: 'reset-password',
      context: {
        title: 'Yêu cầu đặt lại mật khẩu',
        logo: `${this.configService.get('app.backendDomain')}/images/logo-hanu.png`,
        url: `${this.configService.get('app.frontendDomain')}/auth/reset-password?token=${
          mailData.data.forgotPasswordToken
        }`,
        year: new Date().getFullYear(),
      },
    })
  }
}
