import * as React from 'react';
import { TextInputTypes } from '@patternfly/react-core';
import { InputField } from '@console/shared';
import FormSection from '@console/dev-console/src/components/import/section/FormSection';

// export interface DockerSectionProps {
//   buildStrategy: string;
// }

const SinkSection: React.FC<any> = () => (
  <FormSection title="Sink">
    <InputField
      type={TextInputTypes.text}
      name="sink.knativeService"
      label="Knative Service"
      helpText="Need to provide some field level help."
    />
  </FormSection>
);

export default SinkSection;
