import { k8sCreate, K8sResourceKind, referenceForModel } from '@console/internal/module/k8s';
import { FirehoseResource } from '@console/internal/components/utils';
import {
  ServiceModel,
  RevisionModel,
  ConfigurationModel,
  RouteModel,
} from '@console/knative-plugin';
import { getAppLabels } from '@console/dev-console/src/utils/resource-label-utils';

interface ServerlessScaling {
  minpods: number;
  maxpods: number | '';
  concurrencytarget: number | '';
  concurrencylimit: number | '';
}

interface LimitsData {
  cpu: ResourceType;
  memory: ResourceType;
}

interface ResourceType {
  request: number | string;
  requestUnit: string;
  limit: number | string;
  limitUnit: string;
}

export const createKnativeService = (
  name: string,
  applicationName: string,
  namespace: string,
  scaling: ServerlessScaling,
  limits: LimitsData,
  unknownTargetPort,
  labels,
  imageStreamUrl: string,
  imageStreamName?: string,
  annotations?: { [name: string]: string },
  imageTag?: string,
): Promise<K8sResourceKind> => {
  const contTargetPort: number = parseInt(unknownTargetPort, 10);
  const { concurrencylimit, concurrencytarget, minpods, maxpods } = scaling;
  const {
    cpu: {
      request: cpuRequest,
      requestUnit: cpuRequestUnit,
      limit: cpuLimit,
      limitUnit: cpuLimitUnit,
    },
    memory: {
      request: memoryRequest,
      requestUnit: memoryRequestUnit,
      limit: memoryLimit,
      limitUnit: memoryLimitUnit,
    },
  } = limits;
  const defaultLabel = getAppLabels(name, applicationName, imageStreamName, imageTag);
  delete defaultLabel.app;
  const knativeDeployResource: K8sResourceKind = {
    kind: ServiceModel.kind,
    apiVersion: `${ServiceModel.apiGroup}/${ServiceModel.apiVersion}`,
    metadata: {
      name,
      namespace,
    },
    spec: {
      template: {
        metadata: {
          labels: {
            ...defaultLabel,
            ...labels,
          },
          annotations: {
            ...(concurrencytarget && {
              'autoscaling.knative.dev/target': `${concurrencytarget}`,
            }),
            ...(minpods && { 'autoscaling.knative.dev/minScale': `${minpods}` }),
            ...(maxpods && { 'autoscaling.knative.dev/maxScale': `${maxpods}` }),
            ...annotations,
          },
        },
        spec: {
          ...(concurrencylimit && { containerConcurrency: concurrencylimit }),
          containers: [
            {
              image: `${imageStreamUrl}`,
              ...(contTargetPort && {
                ports: [
                  {
                    containerPort: contTargetPort,
                  },
                ],
              }),
              resources: {
                ...((cpuLimit || memoryLimit) && {
                  limits: {
                    ...(cpuLimit && { cpu: `${cpuLimit}${cpuLimitUnit}` }),
                    ...(memoryLimit && { memory: `${memoryLimit}${memoryLimitUnit}` }),
                  },
                }),
                ...((cpuRequest || memoryRequest) && {
                  requests: {
                    ...(cpuRequest && { cpu: `${cpuRequest}${cpuRequestUnit}` }),
                    ...(memoryRequest && { memory: `${memoryRequest}${memoryRequestUnit}` }),
                  },
                }),
              },
            },
          ],
        },
      },
    },
  };

  return k8sCreate(ServiceModel, knativeDeployResource);
};

export const knativeServingResourcesRevision = (namespace: string): FirehoseResource[] => {
  const knativeResource = [
    {
      isList: true,
      kind: referenceForModel(RevisionModel),
      namespace,
      prop: 'revisions',
      optional: true,
    },
  ];
  return knativeResource;
};

export const knativeServingResourcesConfigurations = (namespace: string): FirehoseResource[] => {
  const knativeResource = [
    {
      isList: true,
      kind: referenceForModel(ConfigurationModel),
      namespace,
      prop: 'configurations',
      optional: true,
    },
  ];
  return knativeResource;
};

export const knativeServingResourcesRoutes = (namespace: string): FirehoseResource[] => {
  const knativeResource = [
    {
      isList: true,
      kind: referenceForModel(RouteModel),
      namespace,
      prop: 'ksroutes',
      optional: true,
    },
  ];
  return knativeResource;
};

export const knativeServingResources = (namespace: string): FirehoseResource[] => {
  const knativeResource = [
    ...knativeServingResourcesRevision(namespace),
    ...knativeServingResourcesConfigurations(namespace),
    ...knativeServingResourcesRoutes(namespace),
    {
      isList: true,
      kind: referenceForModel(ServiceModel),
      namespace,
      prop: 'ksservices',
      optional: true,
    },
  ];
  return knativeResource;
};
