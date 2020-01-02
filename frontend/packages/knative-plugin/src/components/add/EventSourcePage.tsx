import * as React from 'react';
import { Helmet } from 'react-helmet';
import { PageHeading, Firehose } from '@console/internal/components/utils';
import NamespacedPage, {
  NamespacedPageVariants,
} from '@console/dev-console/src/components/NamespacedPage';
import EventSource from './EventSource';

const EventSourcePage: React.FC<any> = ({ match }) => {
  const namespace = match.params.ns;
  return (
    <NamespacedPage disabled variant={NamespacedPageVariants.light}>
      <Helmet>
        <title> Event Sources</title>
      </Helmet>
      <PageHeading title="Event Sources" />
      <div />
      <div className="co-m-pane__body">
        <Firehose resources={[{ kind: 'Project', prop: 'projects', isList: true }]}>
          <EventSource namespace={namespace} />
        </Firehose>
      </div>
    </NamespacedPage>
  );
};

export default EventSourcePage;
