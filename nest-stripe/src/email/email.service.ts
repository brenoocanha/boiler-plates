import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { SentMessageInfo } from 'nodemailer/lib/smtp-transport';
import { config } from 'src/config';
import { Email } from './types';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter<SentMessageInfo>;
  private logger = new Logger('EmailService', { timestamp: true });

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: config.email.host,
      port: 465,
      secure: true,
      auth: {
        user: config.email.username,
        pass: config.email.password,
      },
    });
  }

  async sendEmail({ to, subject, html }: Email) {
    this.checkIfEmailExists();
    const mailOptions = {
      from: config.email.from,
      to,
      subject: subject,
      html: html,
    };
    try {
      const email = await this.transporter.sendMail(mailOptions);
      this.logger.verbose(`Sending email to ${to} - Response:`, email);
      return email;
    } catch (error) {
      throw error;
    }
  }

  private checkIfEmailExists() {
    this.transporter.verify((error) => {
      if (error) {
        this.logger.error('Error verifying email:', error);
        throw new InternalServerErrorException(
          'Error verifying email server, please check SMTP settings',
        );
      } else {
        this.logger.verbose('Email server is ready to send messages');
      }
    });
  }
}
