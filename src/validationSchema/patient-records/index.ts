import * as yup from 'yup';

export const patientRecordValidationSchema = yup.object().shape({
  medical_history: yup.string().nullable(),
  user_id: yup.string().nullable().required(),
});
