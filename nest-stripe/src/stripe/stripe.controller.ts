import { Controller, Get } from '@nestjs/common';
import { StripeService } from './stripe.service';

@Controller('stripe')
export class StripeController {
  constructor(private stripeService: StripeService) {}

  @Get('/products')
  async getProducts() {
    return await this.stripeService.getProducts();
  }

  @Get('/customers')
  async getCustomers() {
    return await this.stripeService.getCustomers();
  }

  // @Post('/customers')
  // async createCustomer() {
  //   return await this.stripeService.createCustomer('breno@dmxdesign.com.br');
  // }
}
