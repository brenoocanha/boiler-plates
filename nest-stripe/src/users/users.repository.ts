import { Injectable } from '@nestjs/common';
import { users } from '@prisma/client';
import { SignUpDto } from 'src/auth/dto/sign-up.dto';
import { PrismaConnection } from 'src/infra/database/prisma-connection';

@Injectable()
export class UsersRepository {
  constructor(private prisma: PrismaConnection) {}

  async getAllUsers() {
    return await this.prisma.users.findMany();
  }

  async getUserByEmail(email: users['email']) {
    return await this.prisma.users.findUnique({
      where: { email },
    });
  }

  async signUp({
    signUpDto: { address, ...signUpDto },
    customer_id,
    password,
    code: security_code,
    securityCodeExpiration: security_code_expiration,
  }: {
    signUpDto: SignUpDto;
    customer_id: users['customer_id'];
    password: string;
    code: string;
    securityCodeExpiration: Date;
  }) {
    return await this.prisma.users.create({
      data: {
        ...signUpDto,
        customer_id,
        password,
        address: address && { create: address },
        security_code,
        security_code_expiration,
      },
      select: {
        id: true,
        email: true,
        name: true,
        is_confirmed: true,
      },
    });
  }
}
