import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaConnection } from 'src/infra/database/prisma-connection';
import { UsersRepository } from 'src/users/users.repository';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Utils } from 'src/utils';
import { StripeService } from 'src/stripe/stripe.service';
import { ConfigModule } from '@nestjs/config';
import { config } from 'src/config';

@Module({
  imports: [
    ConfigModule,
    JwtModule.register({
      global: true,
      secret: config.jwt.accessTokenSecret,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    PrismaConnection,
    UsersRepository,
    StripeService,
    JwtService,
    Utils,
    {
      provide: 'STRIPE_API_KEY',
      useValue: config.stripe.apiKey,
    },
  ],
})
export class AuthModule {}
