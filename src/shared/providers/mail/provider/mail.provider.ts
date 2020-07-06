import IMailProvider from '../models/mail-provider.interface';
import { EtherealMailProvider } from '../implementations/ethereal-mail.provider';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailProvider extends EtherealMailProvider
  implements IMailProvider {}
