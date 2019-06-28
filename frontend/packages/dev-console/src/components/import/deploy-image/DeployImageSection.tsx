import * as React from 'react';

import SearchField from './SearchField';
import FormSection from '../section/FormSection';
import LoadingDisplay from './LoadingDisplay';
import ResultsDisplay from './ResultsDisplay';

const DeployImageSection: React.FC = () => {
  return (
    <FormSection
      title="Image Search"
      subTitle="Deploy an existing image from an image registry."
      divider
    >
      <SearchField />
      <LoadingDisplay />
      <ResultsDisplay />
    </FormSection>
  );
};

export default DeployImageSection;
