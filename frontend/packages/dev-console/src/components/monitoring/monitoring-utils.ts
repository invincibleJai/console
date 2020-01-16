import * as _ from 'lodash';
import { K8sResourceKind } from '@console/internal/module/k8s';
import { DeploymentModel, DaemonSetModel, StatefulSetModel } from '@console/internal/models';

export const isMonitoringWorkload = (obj: K8sResourceKind) => {
  return (
    obj.kind === DeploymentModel.kind ||
    obj.kind === StatefulSetModel.kind ||
    obj.kind === DaemonSetModel.kind
  );
};

export const eventKindFilter = (kind, events) => {
  return _.filter(events, (event) => {
    return event.involvedObject.kind === kind;
  });
};

export const getPodsEvents = (pods, events) => {
  const podKindEvents = eventKindFilter('Pod', events);
  return _.map(pods, (pod) => {
    return _.filter(podKindEvents, (event) => {
      return event.involvedObject.name === pod.metadata.name;
    });
  });
};

export const getAlerts = (pods, events) => {
  const podEvents = getPodsEvents(pods, events);
  return _.filter(podEvents[0], (event) => {
    return event.type === 'Warning';
  });
};
