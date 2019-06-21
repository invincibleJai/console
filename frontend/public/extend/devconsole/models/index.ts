// eslint-disable-next-line no-unused-vars
import { K8sKind } from '../../../module/k8s';

export const GitSourceModel: K8sKind = {
  label: 'GitSource',
  labelPlural: 'GitSources',
  apiGroup: 'devconsole.openshift.io',
  crd: true,
  apiVersion: 'v1alpha1',
  path: 'gitsources',
  plural: 'gitsources',
  abbr: 'GS',
  namespaced: true,
  kind: 'GitSource',
};

export const GitSourceComponentModel: K8sKind = {
  label: 'Component',
  labelPlural: 'Components',
  apiGroup: 'devconsole.openshift.io',
  crd: true,
  apiVersion: 'v1alpha1',
  path: 'components',
  plural: 'components',
  abbr: 'C',
  namespaced: true,
  kind: 'Component',
};

export const GitSourceAnalysisModel: K8sKind = {
  label: 'GitSourceAnalysis',
  labelPlural: 'GitSourceAnalyses',
  apiGroup: 'devconsole.openshift.io',
  crd: true,
  apiVersion: 'v1alpha1',
  path: 'gitsourceanalyses',
  plural: 'gitsourceanalyses',
  abbr: 'GSA',
  namespaced: true,
  kind: 'GitSourceAnalysis',
};

export const RevisionModel: K8sKind = {
  apiGroup: 'serving.knative.dev',
  apiVersion: 'v1alpha1',
  label: 'Revision',
  path: 'revisions',
  plural: 'revisions',
  abbr: 'KSREV',
  namespaced: true,
  kind: 'Revision',
  id: 'revision',
  labelPlural: 'Revisions',
};

export const ConfigurationModel: K8sKind = {
  apiGroup: 'serving.knative.dev',
  apiVersion: 'v1alpha1',
  label: 'Configuration',
  path: 'configurations',
  plural: 'configurations',
  abbr: 'KSC',
  namespaced: true,
  kind: 'Configuration',
  id: 'configuration',
  labelPlural: 'Configurations',
};

export const KsrouteModel: K8sKind = {
  apiGroup: 'serving.knative.dev',
  apiVersion: 'v1alpha1',
  label: 'Route',
  labelPlural: 'KsRoutes',
  path: 'routes',
  plural: 'routes',
  abbr: 'KSRT',
  namespaced: true,
  kind: 'Route',
  id: 'ksroute',
  crd: true,
};
