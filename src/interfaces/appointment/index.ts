import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface AppointmentInterface {
  id?: string;
  date_time: any;
  user_id: string;
  created_at?: any;
  updated_at?: any;

  user?: UserInterface;
  _count?: {};
}

export interface AppointmentGetQueryInterface extends GetQueryInterface {
  id?: string;
  user_id?: string;
}
