import { Inject, Injectable } from '@nestjs/common';
import { users } from '@prisma/client';
import { SignUpDto } from 'src/auth/dto/sign-up.dto';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(@Inject('STRIPE_API_KEY') private readonly apiKey: string) {
    this.stripe = new Stripe(this.apiKey, {
      apiVersion: '2024-06-20',
    });
  }

  async getProducts(): Promise<Stripe.Product[]> {
    const products = await this.stripe.products.list();
    return products.data;
  }

  async getCustomers() {
    const customers = await this.stripe.customers.list({});
    return customers.data;
  }

  async createCustomer({
    email,
    address,
    cpfCnpj,
    name,
    phone,
  }: SignUpDto): Promise<Stripe.Customer> {
    const customer = await this.stripe.customers.create({
      email,
      address,
      metadata: {
        cpfCnpj,
        name,
        phone,
      },
    });
    return customer;
  }

  async deleteCustomer(customerId: users['customer_id']) {
    await this.stripe.customers.del(customerId);
  }
}
