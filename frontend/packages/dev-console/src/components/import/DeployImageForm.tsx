import * as React from 'react';
import * as _ from 'lodash';
import { Form, Button } from 'patternfly-react';
import { FormikProps, FormikValues } from 'formik';
import { ButtonBar } from '@console/internal/components/utils';
import { NormalizedBuilderImages } from '../../utils/imagestream-utils';
import DeployImageSection from './deploy-image/DeployImageSection';
import AppSection from './app/AppSection';
import AdvancedSection from './advanced/AdvancedSection';

export interface DeployImageFormProps {
  builderImages?: NormalizedBuilderImages;
}

const DeployImageForm: React.FC<FormikProps<FormikValues> & DeployImageFormProps> = ({
  values,
  errors,
  handleSubmit,
  handleReset,
  status,
  isSubmitting,
  dirty,
}) => (
  <Form className="co-deploy-image">
    <div className="co-m-pane__form">
      <AppSection project={values.project} />
      <DeployImageSection />
      <AdvancedSection values={values} />
    </div>
    <br />
    <ButtonBar errorMessage={status && status.submitError} inProgress={isSubmitting}>
      <Button disabled={!dirty || !_.isEmpty(errors)} bsStyle="primary" onClick={handleSubmit}>
        Deploy
      </Button>
      <Button onClick={handleReset}>Cancel</Button>
    </ButtonBar>
  </Form>
);

export default DeployImageForm;
