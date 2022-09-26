import { /* inject, */ BindingScope, injectable} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import {Stripe} from 'stripe';

export enum PlanListExpandEnum {
  PRODUCT = 'data.product',
}

export enum PlanExpandEnum {
  PRODUCT = 'product',
}

export enum SubscriptionListExpandEnum {
  LATEST_INVOICE = 'data.latest_invoice',
  PLAN = 'data.plan',
  PRODUCT = 'data.plan.product',
  SCHEDULE = 'data.schedule'
}

export enum SubscriptionExpandEnum {
  SCHEDULE = 'schedule',
}

export interface IPostCustomer {
  name: string;
  email: string;
  test_clock: string;
}

const CLIENT_URL = 'http://localhost:4200';

@injectable({scope: BindingScope.TRANSIENT})
export class StripeService {
  private stripe: Stripe;

  constructor() {
    this.init();
  }
  /**
   * Init
   */
  init() {
    this.stripe = new Stripe('sk_test_51K2L68Bih5sDSpchTsMftiQNAcKESo8a7FYb0pc4dw7sVHc9WNyORPg5jXp9ti8bC7OLuMiUMnJ3wrbKkOKm3lQe00feN9OkgF', {
      apiVersion: '2022-08-01',
      typescript: true,
    });
  }

  async getPlans(config: {expand?: PlanListExpandEnum[], limit?: number} = {}) {
    const stripePlans = await this.stripe.plans.list({
      expand: config.expand,
      limit: config.limit,
      active: true,
    });

    return stripePlans.data;
  }

  async getPlanById(id: string, config: {expand?: PlanExpandEnum[]} = {}): Promise<Stripe.Plan> {
    try {
      return this.stripe.plans.retrieve(id, {expand: config.expand});
    } catch (ex) {
      throw new HttpErrors.NotFound('Not found');
    }
  }

  createCustomer(data: IPostCustomer) {
    return this.stripe.customers.create(data);
  }

  deleteCustomer(customerId: string) {
    return this.stripe.customers.del(customerId);
  }

  async getCustomers(config: {expand?: PlanExpandEnum[], limit?: number} = {}) {
    const customers = await this.stripe.customers.list({
      expand: config.expand,
      limit: config.limit,
    });

    return customers.data;
  }

  async getCustomerById(customer: string) {
    try {
      return this.stripe.customers.retrieve(customer);
    } catch (ex) {
      throw new HttpErrors.NotFound('Not found');
    }
  }

  async getCustomerSubscriptions(config: {expand?: SubscriptionListExpandEnum[], limit?: number, customer: string}) {
    const subscriptions = await this.stripe.subscriptions.list({
      customer: config.customer,
      limit: config.limit,
      expand: config.expand
    });

    return subscriptions.data;
  }

  async getCustomerSubscriptionById(subscriptionId: string, config: {expand?: SubscriptionExpandEnum[]} = {}) {
    try {
      return this.stripe.subscriptions.retrieve(subscriptionId, {expand: config.expand});
    } catch (ex) {
      throw new HttpErrors.NotFound('Not found');
    }
  }

  async createCheckoutSessionSubscription(customer: string, planId: string) {
    const sessionModel: Stripe.Checkout.SessionCreateParams = {
      mode: 'subscription',
      payment_method_types: ['card'],
      success_url: `${CLIENT_URL}/stripe/customers/${customer}/subscriptions`,
      cancel_url: `${CLIENT_URL}/stripe/customers/${customer}/subscriptions`,
      customer,
      line_items: [
        {
          price: planId,
          quantity: 1,
        }
      ],
      subscription_data: {
        // trial_period_days: 30,
      },
    }
    return this.stripe.checkout.sessions.create(sessionModel, {idempotencyKey: 'idempotencyKey_' + Math.random()});
  }

  async createSubscriptionSchedule(subscriptionId: string) {
    return this.stripe.subscriptionSchedules.create({
      from_subscription: subscriptionId,
    }, {idempotencyKey: `create_schedule_${Math.random()}`});
  }

  async getTestClocks() {
    const testClocks = await this.stripe.testHelpers.testClocks.list();
    return testClocks.data;
  }
}
