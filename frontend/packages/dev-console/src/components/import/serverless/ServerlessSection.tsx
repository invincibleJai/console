import * as React from 'react';

import FormSection from '../section/FormSection';
import { CheckboxField } from '../../formik-fields';

const ServerlessSection: React.FC = () => {
  return (
    <FormSection
      title="Serverless Option"
      subTitle="Deploy an existing image from an image registry."
      divider
    >
      <div>Tech Preview</div>
      <CheckboxField
        type="checkbox"
        name="serverless.trigger"
        label="Enable scaling to zero when idle"
      />
    </FormSection>
  );
};

export default ServerlessSection;
