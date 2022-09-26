// Uncomment these imports to begin using these cool features!

import {service} from '@loopback/core';
import {get} from '@loopback/rest';
import {StripeService} from '../services';

// import {inject} from '@loopback/core';


export class StripeCustomersController {
  constructor(
    @service(StripeService) private stripeService: StripeService,
  ) { }

  @get('/stripe-customers')
  async getStripePlans() {
    return this.stripeService.getCustomers({
      limit: 100,
    });
  }
}
