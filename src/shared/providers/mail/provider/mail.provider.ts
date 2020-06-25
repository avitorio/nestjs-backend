import IMailProvider from '../models/mail-provider.interface';

interface Message {
  to: string;
  body: string;
}

export class MailProvider implements IMailProvider {
  private messages: Message[] = [];

  async sendMail(to: string, body: string): Promise<void> {
    this.messages.push({
      to,
      body,
    });
  }
}
