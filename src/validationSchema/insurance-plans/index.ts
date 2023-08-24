import * as yup from 'yup';

export const insurancePlanValidationSchema = yup.object().shape({
  plan_details: yup.string().nullable(),
  user_id: yup.string().nullable().required(),
});
