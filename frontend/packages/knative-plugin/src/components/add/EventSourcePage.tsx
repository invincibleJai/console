import * as React from 'react';
import { Helmet } from 'react-helmet';
import { match as RMatch } from 'react-router';
import { PageHeading, Firehose } from '@console/internal/components/utils';
import { ProjectModel, CustomResourceDefinitionModel } from '@console/internal/models';
import { PageBody } from '@console/shared';
import NamespacedPage, {
  NamespacedPageVariants,
} from '@console/dev-console/src/components/NamespacedPage';
import EventSource from './EventSource';

interface EventSourcePageProps {
  match: RMatch<{
    ns?: string;
  }>;
}

const EventSourcePage: React.FC<EventSourcePageProps> = ({ match }) => {
  const namespace = match.params.ns;
  const resources = [
    { kind: ProjectModel.kind, prop: ProjectModel.id, isList: true },
    {
      isList: true,
      kind: CustomResourceDefinitionModel.kind,
      selector: {
        matchLabels: { 'duck.knative.dev/source': 'true' },
      },
      prop: CustomResourceDefinitionModel.id,
      optional: true,
    },
  ];
  return (
    <NamespacedPage disabled variant={NamespacedPageVariants.light}>
      <Helmet>
        <title>Event Sources</title>
      </Helmet>
      <PageHeading title="Event Sources" />
      <PageBody flexLayout>
        <Firehose resources={resources}>
          <EventSource namespace={namespace} />
        </Firehose>
      </PageBody>
    </NamespacedPage>
  );
};

export default EventSourcePage;
