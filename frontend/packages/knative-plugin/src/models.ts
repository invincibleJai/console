import { chart_color_cyan_400 as knativeServingColor } from '@patternfly/react-tokens/dist/js/chart_color_cyan_400';
import { chart_color_red_300 as knativeEventingColor } from '@patternfly/react-tokens/dist/js/chart_color_red_300';
import { K8sKind } from '@console/internal/module/k8s';
import { BadgeType } from '@console/shared/src/components/badges/badge-factory';
import {
  KNATIVE_EVENT_SOURCE_APIGROUP,
  KNATIVE_EVENT_SOURCE_APIGROUP_DEP,
  KNATIVE_SERVING_APIGROUP,
  KNATIVE_EVENT_MESSAGE_APIGROUP,
  KNATIVE_EVENTING_APIGROUP,
  STRIMZI_KAFKA_APIGROUP,
  CAMEL_APIGROUP,
} from './const';

const apiVersion = 'v1';

export const ConfigurationModel: K8sKind = {
  apiGroup: KNATIVE_SERVING_APIGROUP,
  apiVersion,
  kind: 'Configuration',
  plural: 'configurations',
  label: 'Configuration',
  labelPlural: 'Configurations',
  id: 'configuration',
  abbr: 'CFG',
  namespaced: true,
  crd: true,
  color: knativeServingColor.value,
};

export const KnativeServingModel: K8sKind = {
  apiGroup: 'operator.knative.dev',
  apiVersion: 'v1alpha1',
  kind: 'KnativeServing',
  label: 'Knative Serving',
  labelPlural: 'Knative Servings',
  plural: 'knativeservings',
  id: 'knativeserving',
  abbr: 'KS',
  namespaced: true,
  crd: true,
  color: knativeServingColor.value,
};

export const KnativeEventingModel: K8sKind = {
  apiGroup: 'operator.knative.dev',
  apiVersion: 'v1alpha1',
  kind: 'KnativeEventing',
  label: 'Knative Eventing',
  labelPlural: 'Knative Eventings',
  plural: 'knativeeventings',
  id: 'knativeeventing',
  abbr: 'KE',
  namespaced: true,
  crd: true,
  color: knativeEventingColor.value,
};

export const RevisionModel: K8sKind = {
  apiGroup: KNATIVE_SERVING_APIGROUP,
  apiVersion,
  kind: 'Revision',
  label: 'Revision',
  labelPlural: 'Revisions',
  plural: 'revisions',
  id: 'revision',
  abbr: 'REV',
  namespaced: true,
  crd: true,
  color: knativeServingColor.value,
};

export const RouteModel: K8sKind = {
  apiGroup: KNATIVE_SERVING_APIGROUP,
  apiVersion,
  kind: 'Route',
  label: 'Route',
  labelPlural: 'Routes',
  plural: 'routes',
  id: 'route',
  abbr: 'RT',
  namespaced: true,
  crd: true,
  color: knativeServingColor.value,
};

export const ServiceModel: K8sKind = {
  apiGroup: KNATIVE_SERVING_APIGROUP,
  apiVersion,
  kind: 'Service',
  label: 'Service',
  labelPlural: 'Services',
  plural: 'services',
  id: 'service',
  abbr: 'KSVC',
  namespaced: true,
  crd: true,
  color: knativeServingColor.value,
};

export const EventSourceCronJobModel: K8sKind = {
  apiGroup: KNATIVE_EVENT_SOURCE_APIGROUP_DEP,
  apiVersion: 'v1alpha1',
  kind: 'CronJobSource',
  label: 'CronJob Source',
  labelPlural: 'CronJob Sources',
  plural: 'cronjobsources',
  id: 'cronjobsource',
  abbr: 'CJS',
  namespaced: true,
  crd: true,
  color: knativeEventingColor.value,
};

export const EventSourcePingModel: K8sKind = {
  apiGroup: KNATIVE_EVENT_SOURCE_APIGROUP,
  apiVersion: 'v1beta1',
  kind: 'PingSource',
  label: 'Ping Source',
  labelPlural: 'Ping Sources',
  plural: 'pingsources',
  id: 'pingsource',
  abbr: 'PS',
  namespaced: true,
  crd: true,
  color: knativeEventingColor.value,
};

export const EventSourceContainerModel: K8sKind = {
  apiGroup: KNATIVE_EVENT_SOURCE_APIGROUP,
  apiVersion: 'v1beta1',
  kind: 'ContainerSource',
  label: 'Container Source',
  labelPlural: 'Container Sources',
  plural: 'containersources',
  id: 'containersource',
  abbr: 'CS',
  namespaced: true,
  crd: true,
  color: knativeEventingColor.value,
};

export const EventSourceApiServerModel: K8sKind = {
  apiGroup: KNATIVE_EVENT_SOURCE_APIGROUP,
  apiVersion: 'v1beta1',
  kind: 'ApiServerSource',
  label: 'ApiServerSource',
  labelPlural: 'ApiServerSources',
  plural: 'apiserversources',
  id: 'apiserversource',
  abbr: 'AS',
  namespaced: true,
  crd: true,
  color: knativeEventingColor.value,
};

export const EventSourceCamelModel: K8sKind = {
  apiGroup: KNATIVE_EVENT_SOURCE_APIGROUP,
  apiVersion: 'v1alpha1',
  kind: 'CamelSource',
  label: 'CamelSource',
  labelPlural: 'CamelSources',
  plural: 'camelsources',
  id: 'camelsource',
  abbr: 'CS',
  namespaced: true,
  crd: true,
  color: knativeEventingColor.value,
};

export const EventSourceKafkaModel: K8sKind = {
  apiGroup: KNATIVE_EVENT_SOURCE_APIGROUP,
  apiVersion: 'v1beta1',
  kind: 'KafkaSource',
  label: 'KafkaSource',
  labelPlural: 'KafkaSources',
  plural: 'kafkasources',
  id: 'kafkasource',
  abbr: 'KS',
  namespaced: true,
  crd: true,
  color: knativeEventingColor.value,
};

export const EventSourceSinkBindingModel: K8sKind = {
  apiGroup: KNATIVE_EVENT_SOURCE_APIGROUP,
  apiVersion: 'v1beta1',
  kind: 'SinkBinding',
  label: 'SinkBinding',
  labelPlural: 'SinkBindings',
  plural: 'sinkbindings',
  id: 'sinkbindingsource',
  abbr: 'SBS',
  namespaced: true,
  crd: true,
  color: knativeEventingColor.value,
};

export const EventingSubscriptionModel: K8sKind = {
  apiGroup: KNATIVE_EVENT_MESSAGE_APIGROUP,
  apiVersion,
  kind: 'Subscription',
  label: 'Subscription',
  labelPlural: 'Subscriptions',
  plural: 'subscriptions',
  id: 'subscriptioneventing',
  abbr: 'S',
  namespaced: true,
  crd: true,
  color: knativeEventingColor.value,
};

export const EventingIMCModel: K8sKind = {
  apiGroup: KNATIVE_EVENT_MESSAGE_APIGROUP,
  apiVersion,
  kind: 'InMemoryChannel',
  label: 'InMemoryChannel',
  labelPlural: 'inmemorychannels',
  plural: 'inmemorychannels',
  id: 'inmemorychannel',
  abbr: 'IMC',
  namespaced: true,
  crd: true,
  color: knativeEventingColor.value,
};

export const EventingChannelModel: K8sKind = {
  apiGroup: KNATIVE_EVENT_MESSAGE_APIGROUP,
  apiVersion,
  kind: 'Channel',
  label: 'Channel',
  labelPlural: 'channels',
  plural: 'channels',
  id: 'channel',
  abbr: 'C',
  namespaced: true,
  crd: true,
  color: knativeEventingColor.value,
};

export const EventingKafkaChannelModel: K8sKind = {
  apiGroup: KNATIVE_EVENT_MESSAGE_APIGROUP,
  apiVersion: 'v1beta1',
  kind: 'KafkaChannel',
  label: 'Kafka Channel',
  labelPlural: 'Kafka Channels',
  plural: 'kafkachannels',
  id: 'kafkaChannel',
  abbr: 'KC',
  namespaced: true,
  crd: true,
  color: knativeEventingColor.value,
};

export const EventingBrokerModel: K8sKind = {
  apiGroup: KNATIVE_EVENTING_APIGROUP,
  apiVersion,
  kind: 'Broker',
  label: 'Broker',
  labelPlural: 'Brokers',
  plural: 'brokers',
  id: 'broker',
  abbr: 'B',
  namespaced: true,
  crd: true,
  color: knativeEventingColor.value,
};

export const EventingTriggerModel: K8sKind = {
  apiGroup: KNATIVE_EVENTING_APIGROUP,
  apiVersion,
  kind: 'Trigger',
  label: 'Trigger',
  labelPlural: 'Triggers',
  plural: 'triggers',
  id: 'trigger',
  abbr: 'T',
  namespaced: true,
  crd: true,
  color: knativeEventingColor.value,
};

export const CamelIntegrationModel: K8sKind = {
  apiGroup: CAMEL_APIGROUP,
  apiVersion,
  kind: 'Integration',
  label: 'Integration',
  labelPlural: 'Integrations',
  plural: 'integrations',
  id: 'integration',
  abbr: 'I',
  namespaced: true,
  crd: true,
  color: knativeEventingColor.value,
  badge: BadgeType.TECH,
};

export const KafkaModel: K8sKind = {
  apiGroup: STRIMZI_KAFKA_APIGROUP,
  apiVersion: 'v1beta1',
  kind: 'Kafka',
  label: 'Kafka',
  labelPlural: 'Kafkas',
  plural: 'kafkas',
  id: 'kafka',
  abbr: 'K',
  namespaced: true,
  crd: true,
  color: knativeEventingColor.value,
};

export const KafkaTopicModel: K8sKind = {
  apiGroup: STRIMZI_KAFKA_APIGROUP,
  apiVersion: 'v1beta1',
  kind: 'KafkaTopic',
  label: 'KafkaTopic',
  labelPlural: 'KafkaTopics',
  plural: 'kafkatopics',
  id: 'kafkatopic',
  abbr: 'KT',
  namespaced: true,
  crd: true,
  color: knativeEventingColor.value,
};

export const CamelKameletBindingModel: K8sKind = {
  apiGroup: CAMEL_APIGROUP,
  apiVersion: 'v1alpha1',
  kind: 'KameletBinding',
  label: 'Kamelet Binding',
  labelPlural: 'Kamelet Bindings',
  plural: 'kameletbindings',
  id: 'kameletbinding',
  abbr: 'KB',
  namespaced: true,
  crd: true,
  color: knativeEventingColor.value,
  badge: BadgeType.TECH,
};

export const CamelKameletModel: K8sKind = {
  apiGroup: CAMEL_APIGROUP,
  apiVersion: 'v1alpha1',
  kind: 'Kamelet',
  label: 'Kamelet',
  labelPlural: 'Kamelets',
  plural: 'kamelets',
  id: 'kamelet',
  abbr: 'K',
  namespaced: true,
  crd: true,
  color: knativeEventingColor.value,
  badge: BadgeType.TECH,
};

export const CamelIntegrationPlatformModel: K8sKind = {
  apiGroup: CAMEL_APIGROUP,
  apiVersion,
  kind: 'IntegrationPlatform',
  label: 'Integration Platform',
  labelPlural: 'Integration Platforms',
  plural: 'integrationplatforms',
  id: 'integrationplatform',
  abbr: 'IP',
  namespaced: true,
  crd: true,
  color: knativeEventingColor.value,
  badge: BadgeType.TECH,
};

export const ManagedKafkaConnectionModel: K8sKind = {
  apiGroup: 'rhoas.redhat.com',
  apiVersion: 'v1alpha1',
  kind: 'KafkaConnection',
  id: 'kafkaconnection',
  plural: 'kafkaconnections',
  label: 'Kafka Connection',
  labelPlural: 'Kafka Connections',
  abbr: 'AKC',
  namespaced: true,
  crd: true,
};
