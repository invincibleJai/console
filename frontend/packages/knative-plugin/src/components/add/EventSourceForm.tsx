import * as React from 'react';
import * as _ from 'lodash';
import { safeDump } from 'js-yaml';
import { FormikProps, FormikValues } from 'formik';
import { FormFooter } from '@console/shared';
import { Form } from '@patternfly/react-core';
import { K8sKind } from '@console/internal/module/k8s';
import AppSection from '@console/dev-console/src/components/import/app/AppSection';
import { FirehoseList } from '@console/dev-console/src/components/import/import-types';
import CronJobSection from './event-sources/CronJobSection';
import SinkBindingSection from './event-sources/SinkBindingSection';
import ApiServerSection from './event-sources/ApiServerSection';
import SinkSection from './event-sources/SinkSection';
import { EventSources } from './import-types';
import EventSourcesSelector from './event-sources/EventSourcesSelector';
import {
  useEventSourceList,
  getEventSourcesDepResource,
} from '../../utils/create-eventsources-utils';

interface OwnProps {
  namespace: string;
  projects: FirehoseList;
  eventSourceModelList?: K8sKind[];
  eventSourceLoadError?: boolean;
}

const EventSourceForm: React.FC<FormikProps<FormikValues> & OwnProps> = ({
  values,
  errors,
  handleSubmit,
  handleReset,
  setFieldValue,
  setFieldTouched,
  status,
  isSubmitting,
  dirty,
  validateForm,
  namespace,
  projects,
  eventSourceModelList,
  eventSourceLoadError = false,
}) => {
  const handleChange = (item: string) => {
    const selDataModel = _.find(eventSourceModelList, { kind: item });
    const selApiVersion = selDataModel
      ? selDataModel['apiGroup'] + '/' + selDataModel['apiVersion']
      : 'sources.knative.dev/v1alpha1';
    setFieldValue('apiVersion', selApiVersion);
    setFieldTouched('apiVersion', true);
    const YAMLData = safeDump(
      getEventSourcesDepResource({
        ...values,
        ...{ type: item, name: item + 'app', apiVersion: selApiVersion },
      }),
    );
    setFieldValue('chartValuesYAML', YAMLData);
    setFieldTouched('chartValuesYAML', true);
    validateForm();
  };
  const appSinkSection = () => (
    <>
      <SinkSection key={`${values.type}-sink-section`} namespace={namespace} />
      <AppSection
        key={`${values.type}-app-section`}
        project={values.project}
        noProjectsAvailable={projects?.loaded && _.isEmpty(projects.data)}
      />
    </>
  );
  const updateRender = () => {
    switch (values.type) {
      case EventSources.CronJobSource:
        return <CronJobSection />;
      case EventSources.SinkBinding:
        return <SinkBindingSection />;
      case EventSources.ApiServerSource:
        return <ApiServerSection namespace={namespace} />;
      default:
        return null;
    }
  };
  return (
    <Form onSubmit={handleSubmit} key={`${values.type}-form`}>
      <EventSourcesSelector
        eventSourceList={useEventSourceList(eventSourceModelList, eventSourceLoadError)}
        handleChange={handleChange}
      />
      {updateRender()}
      {appSinkSection()}
      {JSON.stringify({ status, errors })}
      <FormFooter
        key={`${values.type}-form-footer`}
        handleReset={handleReset}
        errorMessage={status && status.submitError}
        isSubmitting={isSubmitting}
        submitLabel="Create"
        disableSubmit={!dirty || !_.isEmpty(errors)}
        resetLabel="Cancel"
      />
    </Form>
  );
};

export default EventSourceForm;
