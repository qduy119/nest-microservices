import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as htmlToText from 'html-to-text';
import { ConfigService } from '@nestjs/config';
import { INotificationService } from './notification-service.interface';
import { AppConfig } from './config';

@Injectable()
export class NotificationService implements INotificationService {
  private readonly transporter: nodemailer.Transporter;
  private readonly from: string;

  constructor(private readonly configService: ConfigService) {
    const { service, username, password, from } =
      this.configService.get<AppConfig['mail']>('mail');
    const transporter = nodemailer.createTransport({
      service: service,
      auth: {
        user: username,
        pass: password
      }
    });
    this.transporter = transporter;
    this.from = from;
  }

  async send({
    subject,
    content,
    to
  }: {
    subject: string;
    content: string;
    to: string[] | string;
  }): Promise<void> {
    const mailOptions = {
      from: this.from,
      to,
      subject,
      html: content,
      text: htmlToText.convert(content)
    };
    await this.transporter.sendMail(mailOptions);
  }
}
