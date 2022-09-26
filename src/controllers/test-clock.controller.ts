// Uncomment these imports to begin using these cool features!

import {service} from '@loopback/core';
import {get} from '@loopback/rest';
import {StripeService} from '../services';

// import {inject} from '@loopback/core';


export class TestClockController {
  constructor(
    @service(StripeService) private stripeService: StripeService,
  ) { }

  @get('test-clocks')
  async get() {
    return this.stripeService.getTestClocks();
  }
}
