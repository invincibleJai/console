import * as React from 'react';
import { useFormikContext, FormikValues } from 'formik';
import FormSection from '../section/FormSection';
import CreateRoute from './CreateRoute';
import SecureRoute from './SecureRoute';
import { RouteData } from '../import-types';

interface RouteSectionProps {
  route: RouteData;
}

const RouteSection: React.FC<RouteSectionProps> = ({ route }) => {
  const {
    values: {
      serverless: { trigger: serverlessTrigger },
    },
  } = useFormikContext<FormikValues>();
  return (
    <FormSection title="Routing">
      {route.create && (
        <React.Fragment>
          <CreateRoute />
          {!serverlessTrigger && <SecureRoute />}
        </React.Fragment>
      )}
    </FormSection>
  );
};

export default RouteSection;
