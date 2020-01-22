import { K8sResourceKind } from '@console/internal/module/k8s';
import {
  EventModel,
  DeploymentModel,
  StatefulSetModel,
  DaemonSetModel,
} from '@console/internal/models';
import { FirehoseResource } from '@console/internal/components/utils';

const isWorkloadResource = (res: K8sResourceKind) => {
  return (
    res.kind === DeploymentModel.kind ||
    res.kind === StatefulSetModel.kind ||
    res.kind === DaemonSetModel.kind
  );
};

export const monitoringEventResources = (namespace: string): FirehoseResource[] => {
  const resources = [
    {
      isList: true,
      kind: EventModel.kind,
      prop: 'events',
      namespace,
    },
  ];

  return resources;
};

export const getMonitoringEventResource = (resource: K8sResourceKind, props): any => {
  const events = props && props.events && props.events.data ? props.events.data : [];
  return isWorkloadResource(resource) ? { events } : undefined;
};
