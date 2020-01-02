import * as React from 'react';
import * as _ from 'lodash';
import { FormikProps, FormikValues } from 'formik';
import { ButtonBar } from '@console/internal/components/utils';
import { Form, ActionGroup, ButtonVariant, Button } from '@patternfly/react-core';
// import { EventSourceFormProps } from './import-types';
import AppSection from '@console/dev-console/src/components/import/app/AppSection';
// import AdvancedSection from '@console/dev-console/src/components/import/advanced/AdvancedSection';
// import ResourceSection from '@console/dev-console/src/components/import/section/ResourceSection';
import CronJobSection from './event-sources/CronJobSection';
import SinkSection from './event-sources/SinkSection';

const EventSourceForm: React.FC<FormikProps<FormikValues> & any> = ({
  values,
  errors,
  handleSubmit,
  handleReset,
  status,
  isSubmitting,
  dirty,
  projects,
}) => (
  <Form className="co-deploy-image" onSubmit={handleSubmit}>
    <CronJobSection />
    <SinkSection />
    <AppSection
      project={values.project}
      noProjectsAvailable={projects.loaded && _.isEmpty(projects.data)}
    />
    {/* <AdvancedSection values={values} /> */}
    <ButtonBar errorMessage={status && status.submitError} inProgress={isSubmitting}>
      <ActionGroup className="pf-c-form">
        <Button
          type="submit"
          variant={ButtonVariant.primary}
          isDisabled={!dirty || !_.isEmpty(errors)}
          data-test-id="deploy-image-form-submit-btn"
        >
          Create
        </Button>
        <Button type="button" variant={ButtonVariant.secondary} onClick={handleReset}>
          Cancel
        </Button>
      </ActionGroup>
    </ButtonBar>
  </Form>
);

export default EventSourceForm;
