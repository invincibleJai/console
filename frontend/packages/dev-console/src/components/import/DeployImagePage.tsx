import * as React from 'react';
import { match as RMatch } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { PageHeading } from '@console/internal/components/utils';
import DeployImage from './DeployImage';

export interface ImportPageProps {
  match: RMatch<{ ns?: string }>;
}

const DeployImagePage: React.FunctionComponent<ImportPageProps> = ({ match }) => {
  const namespace = match.params.ns;
  return (
    <React.Fragment>
      <Helmet>
        <title>Deploy Image</title>
      </Helmet>
      <PageHeading title="Deploy Image" />
      <div className="co-m-pane__body">
        <DeployImage namespace={namespace} />
      </div>
    </React.Fragment>
  );
};

export default DeployImagePage;
