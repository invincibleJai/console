import * as React from "react";
import * as _ from "lodash-es";
import { ListGroup } from "patternfly-react";

import { K8sResourceKind } from "../../module/k8s";
import { ResourceLink, SidebarSectionHeading, ExternalLink } from "../utils";

const RevisionsOverviewListItem: React.SFC<RevisionsOverviewListItemProps> = ({
  revision
}) => {
  const { name, namespace } = revision.metadata;
  return (
    <li className="list-group-item">
      <ResourceLink
        kind="serving.knative.dev~v1alpha1~Revision"
        name={name}
        namespace={namespace}
      />
    </li>
  );
};

const RevisionsOverviewList: React.SFC<RevisionsOverviewListProps> = ({
  revisions
}) => (
  <ListGroup componentClass="ul">
    {_.map(revisions, revision => (
      <RevisionsOverviewListItem
        key={revision.metadata.uid}
        revision={revision}
      />
    ))}
  </ListGroup>
);

const KSRoutesOverviewListItem: React.SFC<KSRoutesOverviewListItemProps> = ({
  route
}) => {
  const { name, namespace } = route.metadata;
  return (
    <li className="list-group-item">
      <ResourceLink
        kind="serving.knative.dev~v1alpha1~Route"
        name={name}
        namespace={namespace}
      />
      <span className="text-muted">{"Location: "}</span>
      <ExternalLink
        href={route.status.url}
        additionalClassName="co-external-link--block"
        text={route.status.url}
      />
    </li>
  );
};

const KSRoutesOverviewList: React.SFC<KSRoutesOverviewListProps> = ({
  ksroutes
}) => (
  <ListGroup componentClass="ul">
    {_.map(ksroutes, route => (
      <KSRoutesOverviewListItem key={route.metadata.uid} route={route} />
    ))}
  </ListGroup>
);

const ConfigurationsOverviewListItem: React.SFC<
  ConfigurationsOverviewListItemProps
> = ({ configuration }) => {
  const { name, namespace } = configuration.metadata;
  return (
    <li className="list-group-item">
      <ResourceLink
        kind="serving.knative.dev~v1alpha1~Configuration"
        name={name}
        namespace={namespace}
      />
      <span className="text-muted">{"Latest Created Revision name: "}</span>
      <span>{configuration.status.latestCreatedRevisionName}</span>
      <br/>
      <span className="text-muted">{"Latest Ready Revision name: "}</span>
      <span>{configuration.status.latestReadyRevisionName}</span>
    </li>
  );
};

const ConfigurationsOverviewList: React.SFC<
  ConfigurationsOverviewListProps
> = ({ configurations }) => (
  <ListGroup componentClass="ul">
    {_.map(configurations, configuration => (
      <ConfigurationsOverviewListItem
        key={configuration.metadata.uid}
        configuration={configuration}
      />
    ))}
  </ListGroup>
);

export const KnativeOverview: React.SFC<KnativeOverviewProps> = ({
  ksroutes,
  configurations,
  revisions
}) => {
  return (
    <React.Fragment>
      <SidebarSectionHeading text="Revisions" />
      {_.isEmpty(revisions) ? (
        <span className="text-muted">
          No Revisions found for this resource.
        </span>
      ) : (
        <RevisionsOverviewList revisions={revisions} />
      )}

      <SidebarSectionHeading text="Routes" />
      {_.isEmpty(ksroutes) ? (
        <span className="text-muted">No Routes found for this resource.</span>
      ) : (
        <KSRoutesOverviewList ksroutes={ksroutes} />
      )}

      <SidebarSectionHeading text="Configurations" />
      {_.isEmpty(configurations) ? (
        <span className="text-muted">
          No Configurations found for this resource.
        </span>
      ) : (
        <ConfigurationsOverviewList configurations={configurations} />
      )}
    </React.Fragment>
  );
};

type RevisionsOverviewListProps = {
  revisions: K8sResourceKind[];
};

type RevisionsOverviewListItemProps = {
  revision: K8sResourceKind;
};

type KSRoutesOverviewListProps = {
  ksroutes: K8sResourceKind[];
};

type KSRoutesOverviewListItemProps = {
  route: K8sResourceKind;
};

type ConfigurationsOverviewListProps = {
  configurations: K8sResourceKind[];
};

type ConfigurationsOverviewListItemProps = {
  configuration: K8sResourceKind;
};

type KnativeOverviewProps = {
  ksroutes: K8sResourceKind[];
  configurations: K8sResourceKind[];
  revisions: K8sResourceKind[];
};
