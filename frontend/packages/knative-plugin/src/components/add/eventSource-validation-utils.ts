import * as yup from 'yup';
import {
  nameValidationSchema,
  projectNameValidationSchema,
  applicationNameValidationSchema,
  limitsValidationSchema,
  resourcesValidationSchema,
} from '@console/dev-console/src/components/import/validation-schema';

export const eventSourceValidationSchema = yup.object().shape({
  project: projectNameValidationSchema,
  application: applicationNameValidationSchema,
  name: nameValidationSchema,
  limits: limitsValidationSchema,
  resources: resourcesValidationSchema,
});
