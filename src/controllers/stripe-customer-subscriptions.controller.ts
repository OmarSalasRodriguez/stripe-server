// Uncomment these imports to begin using these cool features!

import {service} from '@loopback/core';
import {get, param, post, requestBody} from '@loopback/rest';
import {StripeService, SubscriptionListExpandEnum} from '../services';

// import {inject} from '@loopback/core';


export class StripeCustomerSubscriptionsController {
  constructor(
    @service(StripeService) private stripeService: StripeService,
  ) { }

  @get('/stripe-customers/{customerId}/subscriptions')
  async getStripePlans(
    @param.path.string('customerId', {required: true}) customerId: string,
  ) {
    return this.stripeService.getCustomerSubscriptions({
      customer: customerId,
      expand: [SubscriptionListExpandEnum.LATEST_INVOICE, SubscriptionListExpandEnum.PRODUCT, SubscriptionListExpandEnum.SCHEDULE],
      limit: 100,
    });
  }

  @post('/stripe-customers/{customerId}/subscriptions')
  async createCheckoutSessionSubscription(
    @param.path.string('customerId', {required: true}) customerId: string,
    @requestBody({
      required: true,
      content: {
        'application/json': {
          schema: {
            required: ['planId'],
            properties: {
              planId: {
                type: 'string'
              }
            }
          }
        }
      }
    }) {planId}: {planId: string}
  ) {
    const plan = await this.stripeService.getPlanById(planId);
    const customer = await this.stripeService.getCustomerById(customerId);

    return this.stripeService.createCheckoutSessionSubscription(customer.id, plan.id);
  }

  @post('/stripe-customers/{customerId}/subscriptions/{subscriptionId}')
  async createSubscriptionSchedule(
    @param.path.string('customerId', {required: true}) customerId: string,
    @param.path.string('subscriptionId', {required: true}) subscriptionId: string,
  ) {
    await this.stripeService.getCustomerById(customerId);
    await this.stripeService.getCustomerSubscriptionById(subscriptionId);

    return this.stripeService.createSubscriptionSchedule(subscriptionId);
  }




}
