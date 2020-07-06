import IMailProvider from '../models/mail-provider.interface';

interface Message {
  to: string;
  body: string;
}

export default class MailProviderFake implements IMailProvider {
  private messages: Message[] = [];

  async sendMail(to: string, body: string): Promise<void> {
    this.messages.push({
      to,
      body,
    });
  }
}