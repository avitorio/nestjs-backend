import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { PasswordRecoveryEmailService } from './password-recovery/password-recovery-email.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { MailProvider } from '../shared/providers/mail/provider/mail.provider';
import { UserTokensRepository } from './password-recovery/user-tokens.repository';
import { UsersResolver } from './users.resolver';
import { BCryptHashProvider } from '../shared/providers/hash/provider/bcrypt-hash.provider';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRepository]),
    TypeOrmModule.forFeature([UserTokensRepository]),
  ],
  providers: [
    UsersResolver,
    UsersService,
    PasswordRecoveryEmailService,
    MailProvider,
    { provide: 'HashProvider', useClass: BCryptHashProvider }
  ],
})
export class UsersModule {}
