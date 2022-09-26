import {Model, model, property} from '@loopback/repository';

@model()
export class StripePlan extends Model {

  constructor(data?: Partial<StripePlan>) {
    super(data);
  }
}

export interface StripePlanRelations {
  // describe navigational properties here
}

export type StripePlanWithRelations = StripePlan & StripePlanRelations;
