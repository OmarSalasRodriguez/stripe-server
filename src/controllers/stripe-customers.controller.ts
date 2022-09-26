// Uncomment these imports to begin using these cool features!

import {service} from '@loopback/core';
import {del, get, param} from '@loopback/rest';
import {StripeService} from '../services';

// import {inject} from '@loopback/core';


export class StripeCustomersController {
  constructor(
    @service(StripeService) private stripeService: StripeService,
  ) { }

  @get('/stripe-customers')
  async get() {
    return this.stripeService.getCustomers({
      limit: 100,
    });
  }

  @del('/stripe-customers/{id}')
  async del(
    @param.path.string('id', {required: true}) id: string,
  ) {
    return this.stripeService.deleteCustomer(id);
  }
}
