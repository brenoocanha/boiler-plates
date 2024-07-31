import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { UsersRepository } from '../users/users.repository';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/sign-up.dto';
import { Utils } from 'src/utils';
import * as bcrypt from 'bcrypt';
import { StripeService } from 'src/stripe/stripe.service';
import Stripe from 'stripe';
import { users } from '@prisma/client';
import { SignInDto } from './dto/sign-in.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { config } from 'src/config';

@Injectable()
export class AuthService {
  constructor(
    private stripeService: StripeService,
    private usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
    private utils: Utils,
  ) {}

  private logger = new Logger('AuthService', { timestamp: true });

  async signUp(signUpDto: SignUpDto) {
    const code = this.utils.generateRandomCode(6);
    const securityCodeExpiration = this.utils.generateHoursFromNow(2);
    const hashedPassword = await this.hashPassword(signUpDto.password);
    await this.checkIfEmailExists(signUpDto);
    const stripeCustomer = await this.createCustomerOnStripe(signUpDto);
    try {
      const user = await this.usersRepository.signUp({
        signUpDto,
        password: hashedPassword,
        code,
        securityCodeExpiration,
        customer_id: stripeCustomer.id,
      });
      this.logger.verbose(`User ${user.name} created in database`);
      return {
        user,
        stripeCustomer,
      };
    } catch (error) {
      this.logger.error(
        `Error creating user in database, deleting user ${stripeCustomer.name} with customer_id ${stripeCustomer.id} from Stripe`,
      );
      await this.deleteCustomerFromStripe(stripeCustomer.id);
      throw error;
    }
  }

  private async checkIfEmailExists(signUpDto: SignUpDto) {
    const userFound = await this.usersRepository.getUserByEmail(
      signUpDto.email,
    );
    if (userFound) {
      throw new BadRequestException('Email already exists');
    }
  }

  private async createCustomerOnStripe(
    signUpDto: SignUpDto,
  ): Promise<Stripe.Customer> {
    try {
      const customer = await this.stripeService.createCustomer(signUpDto);
      this.logger.verbose(
        `User ${customer.name} with customer_id ${customer.id} created on Stripe`,
      );
      return customer;
    } catch (error) {
      this.logger.error(
        `Error creating user with email ${signUpDto.email} on Stripe`,
      );
      throw error;
    }
  }

  private async deleteCustomerFromStripe(customer_id: users['customer_id']) {
    try {
      const deletedCustomer =
        await this.stripeService.deleteCustomer(customer_id);
      this.logger.verbose(
        `User with customer_id ${customer_id} deleted from Stripe`,
      );
      return deletedCustomer;
    } catch (error) {
      this.logger.error(
        `Error deleting user with customer_id ${customer_id} from Stripe`,
      );
      throw error;
    }
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(password, salt);
  }

  async signIn(signInDto: SignInDto) {
    const user = await this.usersRepository.getUserByEmail(signInDto.email);
    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }
    const isPasswordValid = await bcrypt.compare(
      signInDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid credentials');
    }

    return await this.generateJWT(user);
  }

  private async generateJWT(user: users) {
    const accessToken = this.jwtService.sign(
      { email: user.email, sub: user.id },
      {
        secret: config.jwt.accessTokenSecret,
        expiresIn: 60 * 60 * 2, // 2 hours
      },
    );

    const refreshToken = this.jwtService.sign(
      { email: user.email, sub: user.id },
      {
        secret: config.jwt.refreshTokenSecret,
        expiresIn: 60 * 60 * 24 * 3, // 3 days
      },
    );

    return { access_token: accessToken, refresh_token: refreshToken };
  }

  async refreshToken({ refresh_token }: RefreshTokenDto) {
    const decoded = this.jwtService.verify(refresh_token, {
      secret: config.jwt.refreshTokenSecret,
    });

    return await this.generateJWT(decoded);
  }
}
