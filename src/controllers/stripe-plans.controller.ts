// Uncomment these imports to begin using these cool features!

import {service} from '@loopback/core';
import {get} from '@loopback/rest';
import {PlanListExpandEnum, StripeService} from '../services';

// import {inject} from '@loopback/core';


export class StripePlansController {
  constructor(
    @service(StripeService) private stripeService: StripeService,
  ) { }

  @get('/stripe-plans')
  async getStripePlans() {
    return this.stripeService.getPlans({
      expand: [PlanListExpandEnum.PRODUCT],
      limit: 10,
    });
  }
}
