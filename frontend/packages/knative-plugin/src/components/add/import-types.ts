// import { K8sResourceKind, ContainerPort } from '@console/internal/module/k8s';
// import { LazyLoader } from '@console/plugin-sdk';
// import { NameValuePair, NameValueFromPair } from '@console/shared';

export interface ProjectData {
  name: string;
  displayName: string;
  description: string;
}

export interface ApplicationData {
  initial: string;
  name: string;
  selectedKey: string;
}

export interface EventSourceFormData {
  project: ProjectData;
  application: ApplicationData;
  name: string;
  searchTerm: string;
  registry: string;
  imageStream: {
    image: string;
    tag: string;
    namespace: string;
    grantAccess?: boolean;
  };
  resources: any;
  labels: { [name: string]: string };
  env: { [name: string]: string };
  limits: any;
}
