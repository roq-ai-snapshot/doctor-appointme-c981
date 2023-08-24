import axios from 'axios';
import queryString from 'query-string';
import { InsurancePlanInterface, InsurancePlanGetQueryInterface } from 'interfaces/insurance-plan';
import { GetQueryInterface, PaginatedInterface } from '../../interfaces';

export const getInsurancePlans = async (
  query?: InsurancePlanGetQueryInterface,
): Promise<PaginatedInterface<InsurancePlanInterface>> => {
  const response = await axios.get('/api/insurance-plans', {
    params: query,
    headers: { 'Content-Type': 'application/json' },
  });
  return response.data;
};

export const createInsurancePlan = async (insurancePlan: InsurancePlanInterface) => {
  const response = await axios.post('/api/insurance-plans', insurancePlan);
  return response.data;
};

export const updateInsurancePlanById = async (id: string, insurancePlan: InsurancePlanInterface) => {
  const response = await axios.put(`/api/insurance-plans/${id}`, insurancePlan);
  return response.data;
};

export const getInsurancePlanById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/insurance-plans/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteInsurancePlanById = async (id: string) => {
  const response = await axios.delete(`/api/insurance-plans/${id}`);
  return response.data;
};
