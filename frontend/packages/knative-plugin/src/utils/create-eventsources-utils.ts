import * as _ from 'lodash';
import { K8sResourceKind, referenceForModel, K8sKind } from '@console/internal/module/k8s';
import { useAccessReview } from '@console/internal/components/utils';
import { getAppLabels } from '@console/dev-console/src/utils/resource-label-utils';
import { annotations } from '@console/dev-console/src/utils/shared-submit-utils';
// import { EventSources } from '../components/add/import-types';
import {
  ServiceModel,
  EventSourceCronJobModel,
  EventSourceSinkBindingModel,
  EventSourceApiServerModel,
  EventSourceCamelModel,
  EventSourceKafkaModel,
} from '../models';
// import { KNATIVE_EVENT_SOURCE_APIGROUP, KNATIVE_EVENT_SOURCE_APIGROUP_DEP } from '../const';
import { getKnativeEventSourceIcon } from './get-knative-icon';

export const getEventSourcesDepResource = (formData: any): K8sResourceKind => {
  const {
    type,
    name,
    apiVersion,
    application: { name: applicationName },
    project: { name: namespace },
    data,
    sink: { knativeService },
  } = formData;

  const defaultLabel = getAppLabels(name, applicationName);
  const eventSrcData = data[type.toLowerCase()];
  const eventSourceResource: K8sResourceKind = {
    kind: type,
    apiVersion,
    metadata: {
      name,
      namespace,
      labels: {
        ...defaultLabel,
      },
      annotations,
    },
    spec: {
      sink: {
        ref: {
          apiVersion: `${ServiceModel.apiGroup}/${ServiceModel.apiVersion}`,
          kind: ServiceModel.kind,
          name: knativeService,
        },
      },
      ...(eventSrcData && eventSrcData),
    },
  };

  return eventSourceResource;
};

export const getEventSourceData = (source: string) => {
  const eventSourceData = {
    cronjobsource: {
      data: '',
      schedule: '',
    },
    sinkbinding: {
      subject: {
        apiVersion: '',
        kind: 'test',
        selector: {
          matchLabels: {},
        },
      },
    },
    apiserversource: {
      mode: 'Ref',
      serviceAccountName: '',
      resources: [
        {
          apiVersion: '',
          kind: '',
        },
      ],
    },
  };
  return eventSourceData[source] ? eventSourceData[source] : {};
};

export const useKnativeEventingAccess = (model: K8sKind, namespace: string): boolean => {
  const canCreateEventSource = useAccessReview({
    group: model.apiGroup,
    resource: model.plural,
    namespace,
    verb: 'create',
  });
  return canCreateEventSource;
};

export const getEventSourceModelList = () => {
  const eventSourceList = [
    EventSourceCronJobModel,
    EventSourceSinkBindingModel,
    EventSourceApiServerModel,
    EventSourceKafkaModel,
    EventSourceCamelModel,
  ];
  return eventSourceList;
};

export const useEventSourceList = (eventSourceModelList, eventSourceLoadError: boolean) => {
  let eventSourceModelListData = eventSourceLoadError
    ? getEventSourceModelList()
    : eventSourceModelList;
  const eventSourceList = _.reduce(
    eventSourceModelListData,
    (accumulator, eventSourceModel) => {
      return {
        ...accumulator,
        ...(useKnativeEventingAccess(eventSourceModel) && {
          [eventSourceModel.kind]: {
            name: eventSourceModel.kind,
            iconUrl: getKnativeEventSourceIcon(referenceForModel(eventSourceModel)),
            displayName: eventSourceModel.kind,
            title: eventSourceModel.kind,
          },
        }),
      };
    },
    {},
  );
  return eventSourceList;
};
