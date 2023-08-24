import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface InsurancePlanInterface {
  id?: string;
  plan_details?: string;
  user_id: string;
  created_at?: any;
  updated_at?: any;

  user?: UserInterface;
  _count?: {};
}

export interface InsurancePlanGetQueryInterface extends GetQueryInterface {
  id?: string;
  plan_details?: string;
  user_id?: string;
}
