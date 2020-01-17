import { K8sResourceKind } from '@console/internal/module/k8s';
import { DeploymentModel, DaemonSetModel, StatefulSetModel } from '@console/internal/models';

export const isMonitoringWorkload = (obj: K8sResourceKind) => {
  return (
    obj.kind === DeploymentModel.kind ||
    obj.kind === StatefulSetModel.kind ||
    obj.kind === DaemonSetModel.kind
  );
};
