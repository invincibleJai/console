import * as React from 'react';
import { TextInputTypes } from '@patternfly/react-core';
import { InputField } from '@console/shared';
import FormSection from '@console/dev-console/src/components/import/section/FormSection';

// export interface DockerSectionProps {
//   buildStrategy: string;
// }

const CronJobSection: React.FC<any> = () => (
  <FormSection title="CronJobSource">
    <InputField
      type={TextInputTypes.text}
      name="cronjobsource.data"
      label="Data"
      helpText="Need to provide some field level help."
    />
    <InputField
      type={TextInputTypes.text}
      name="cronjobsource.schedule"
      label="Schedule"
      helpText="Need to provide some field level help."
      style={{ maxWidth: '100%' }}
    />
  </FormSection>
);

export default CronJobSection;
