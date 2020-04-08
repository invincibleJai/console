import * as yup from 'yup';
import {
  nameValidationSchema,
  projectNameValidationSchema,
  applicationNameValidationSchema,
} from '@console/dev-console/src/components/import/validation-schema';
import { EventSources } from './import-types';

const sinkServiceSchema = yup.object().shape({
  knativeService: yup.string().required('Required'),
});

export const sourceDataSpecSchema = yup
  .object()
  .when('type', {
    is: EventSources.CronJobSource,
    then: yup.object().shape({
      cronjobsource: yup.object().shape({
        data: yup
          .string()
          .max(253, 'Cannot be longer than 253 characters.')
          .required('Required'),
        schedule: yup
          .string()
          .max(253, 'Cannot be longer than 253 characters.')
          .required('Required'),
      }),
    }),
  })
  .when('type', {
    is: EventSources.SinkBinding,
    then: yup.object().shape({
      sinkbinding: yup.object().shape({
        subject: yup.object().shape({
          selector: yup.object().shape({
            matchLabels: yup.object(),
          }),
          apiVersion: yup
            .string()
            .max(253, 'Cannot be longer than 253 characters.')
            .required('Required'),
          kind: yup
            .string()
            .max(253, 'Cannot be longer than 253 characters.')
            .required('Required'),
        }),
      }),
    }),
  });

const ownEvenstSources = Object.keys(EventSources);
export const eventSourceValidationSchema = yup.object().shape({
  project: yup.object().when('type', {
    is: (type) => ownEvenstSources.includes(type),
    then: projectNameValidationSchema,
  }),
  application: yup.object().when('type', {
    is: (type) => ownEvenstSources.includes(type),
    then: applicationNameValidationSchema,
  }),
  name: yup.string().when('type', {
    is: (type) => ownEvenstSources.includes(type),
    then: nameValidationSchema,
  }),
  sink: yup.object().when('type', {
    is: (type) => ownEvenstSources.includes(type),
    then: sinkServiceSchema,
  }),
  data: yup.object().when('type', {
    is: (type) => ownEvenstSources.includes(type),
    then: sourceDataSpecSchema,
  }),
  chartValuesYAML: yup.string(),
});
