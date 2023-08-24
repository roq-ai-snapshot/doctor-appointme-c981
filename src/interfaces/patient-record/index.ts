import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface PatientRecordInterface {
  id?: string;
  medical_history?: string;
  user_id: string;
  created_at?: any;
  updated_at?: any;

  user?: UserInterface;
  _count?: {};
}

export interface PatientRecordGetQueryInterface extends GetQueryInterface {
  id?: string;
  medical_history?: string;
  user_id?: string;
}
