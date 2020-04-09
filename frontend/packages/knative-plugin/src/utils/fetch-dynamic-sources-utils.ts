import * as _ from 'lodash';
import { coFetch } from '@console/internal/co-fetch';
import { K8sKind } from '@console/internal/module/k8s';
import { chart_color_red_300 as knativeEventingColor } from '@patternfly/react-tokens';
import {
  EventSourceCronJobModel,
  EventSourceContainerModel,
  EventSourceApiServerModel,
  EventSourceSinkBindingModel,
  EventSourceKafkaModel,
  EventSourceCamelModel,
} from '../models';

export let eventSourceModels: K8sKind[];

// export const getSourcesModel = () => {
//   const url =
//     'api/kubernetes/apis/apiextensions.k8s.io/v1beta1/customresourcedefinitions?limit=250&labelSelector=duck.knative.dev%2Fsource%3Dtrue';
//   coFetch(url)
//     .then((response) => response.json())
//     .then((body) => {
//       eventSourceModels = _.map(body?.items, (crd) => {
//         const {
//           spec: { group, version, names },
//         } = crd;
//         return {
//           apiGroup: group,
//           apiVersion: version,
//           kind: names?.kind,
//           plural: names?.plural,
//           id: names?.singular,
//           label: names?.singular,
//           labelPlural: names?.plural,
//           abbr: names?.kind?.replace(/[a-z]/g, ''),
//           namespaced: true,
//           crd: true,
//           color: knativeEventingColor.value,
//         };
//       });
//     })
//     .catch((e) => {
//       eventSourceModels = [
//         EventSourceApiServerModel,
//         EventSourceSinkBindingModel,
//         EventSourceKafkaModel,
//       ];
//       console.error(e);
//     });
// };

export const getSourcesModel = async () => {
  const url = `api/kubernetes/apis/apiextensions.k8s.io/v1beta1/customresourcedefinitions?limit=250&labelSelector=${encodeURIComponent(
    'duck.knative.dev/source=true',
  )}`;
  try {
    const res = await coFetch(url);
    const resolvedRes = await res.json();
    eventSourceModels = _.map(resolvedRes?.items, (crd) => {
      const {
        spec: { group, version, names },
      } = crd;
      return {
        apiGroup: group,
        apiVersion: version,
        kind: names?.kind,
        plural: names?.plural,
        id: names?.singular,
        label: names?.singular,
        labelPlural: names?.plural,
        abbr: names?.kind?.replace(/[a-z]/g, ''),
        namespaced: true,
        crd: true,
        color: knativeEventingColor.value,
      };
    });
  } catch {
    eventSourceModels = [
      EventSourceCronJobModel,
      EventSourceContainerModel,
      EventSourceApiServerModel,
      EventSourceSinkBindingModel,
      EventSourceKafkaModel,
      EventSourceCamelModel,
    ];
  }
};

// TODO: util to get firehose resources
// TODO: utils to get pops list
// TODO: util to get isEventingResource
