import * as nodemailer from 'nodemailer';
import IMailProvider from '../models/mail-provider.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EtherealMailProvider implements IMailProvider {
  private client: nodemailer.Transporter;

  constructor() {
    nodemailer.createTestAccount().then(account => {
      const transporter = nodemailer.createTransport({
        host: account.smtp.host,
        port: account.smtp.port,
        auth: {
          user: account.user,
          pass: account.pass,
        },
      });

      this.client = transporter;
    });
  }

  async sendMail(to: string, body: string): Promise<void> {
    const message = {
      from: 'The Backend Team <team@thebackend.com>',
      to,
      subject: '🚀 Nodemailer is unicode friendly',
      text: body,
    };

    this.client.sendMail(message, (err, info) => {
      if (err) {
        console.log('Error occurred. ' + err.message);
        return process.exit(1);
      }

      console.log('Message sent: %s', info.messageId);
      // Preview only available when sending through an Ethereal account
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    });
  }
}
