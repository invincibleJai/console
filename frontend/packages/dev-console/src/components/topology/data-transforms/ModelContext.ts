import { createContext } from 'react';
import * as _ from 'lodash';
import { Model } from '@patternfly/react-topology';
import { WatchK8sResources } from '@console/internal/components/utils/k8s-watch-hook';
import {
  TopologyDataModelDepicted,
  TopologyDataModelGetter,
  TopologyDataResources,
} from '../topology-types';
import {
  addToTopologyDataModel,
  getBaseWatchedResources,
  getWorkloadResources,
} from './transform-utils';
import { K8sResourceKind } from '@console/internal/module/k8s';
import { WORKLOAD_TYPES } from '../topology-utils';

export type ModelExtensionContext = {
  priority: number;
  resources?: (namespace: string) => WatchK8sResources<any>;
  dynamicresources?: (namespace: string) => Promise<any>;
  workloadKeys?: string[];
  dataModelGetter?: TopologyDataModelGetter;
  dataModelDepicter?: TopologyDataModelDepicted;
};

export class ExtensibleModel {
  private extensions: { [id: string]: ModelExtensionContext } = {};

  private namespaceP: string;

  private modelP: Model = { nodes: [], edges: [] };

  public dataResources: TopologyDataResources = {};

  public extensionsLoaded: boolean = false;

  public watchedResources: WatchK8sResources<any> = {};

  public onExtensionsLoaded: (extensibleModel: ExtensibleModel) => void;

  public constructor(namespace?: string) {
    this.namespace = namespace;
  }

  public get namespace(): string {
    return this.namespaceP;
  }

  public set namespace(namespace: string) {
    this.namespaceP = namespace;
  }

  private updateExtensionsLoaded(): void {
    const extensionKeys = Object.keys(this.extensions);
    const prev = this.extensionsLoaded;
    this.extensionsLoaded =
      extensionKeys.length > 1 &&
      extensionKeys.every(
        (key) => !!this.extensions[key].dataModelGetter && !!this.extensions[key].dataModelDepicter,
      );
    if (!prev && this.extensionsLoaded && this.onExtensionsLoaded) {
      this.onExtensionsLoaded(this);
    }
  }

  public getExtensions(): { [id: string]: ModelExtensionContext } {
    return this.extensions;
  }

  public getExtension(id: string): ModelExtensionContext {
    return this.extensions[id];
  }

  public get workloadKeys(): string[] {
    const workloadKeys = [...WORKLOAD_TYPES];
    Object.keys(this.extensions).forEach((key) => {
      if (this.extensions[key].workloadKeys) {
        this.extensions[key].workloadKeys.forEach((workloadKey) => {
          if (!workloadKeys.includes(workloadKey)) {
            workloadKeys.push(workloadKey);
          }
        });
      }
    });
    return workloadKeys;
  }

  public updateWatchedResources = (): void => {
    const extensionKeys = Object.keys(this.extensions);
    this.watchedResources = extensionKeys.reduce(
      (acc, key) => {
        if (this.extensions[key].resources) {
          const resList = this.extensions[key].resources(this.namespace);
          Object.keys(resList).forEach((resKey) => {
            if (!acc[resKey]) {
              acc[resKey] = resList[resKey];
            }
          });
        }
        return acc;
      },
      { ...getBaseWatchedResources(this.namespace), ...this.watchedResources },
    );
  };

  public updateDynamicWatchedResources = (): void => {
    const extensionKeys = Object.keys(this.extensions);
    const promiseData = [];
    // extensionKeys.reduce((acc, key) => {
    //   if (this.extensions[key].dynamicresources) {
    //     promiseData.push(
    //       this.extensions[key]
    //         .dynamicresources(this.namespace)
    //         .then((resList) => {
    //           Object.keys(resList).forEach((resKey) => {
    //             if (!acc[resKey]) {
    //               acc[resKey] = resList[resKey];
    //             }
    //           });
    //         })
    //         .catch((err) => {
    //           // eslint-disable-next-line no-console
    //           console.warn('Error fetching CRDs for dynamic event sources', err);
    //         }),
    //     );
    //   }
    //   return acc;
    // }, this.watchedResources);

    _.forIn(extensionKeys, (val: string) => {
      if (this.extensions[val].dynamicresources) {
        promiseData.push(
          this.extensions[val]
            .dynamicresources(this.namespace)
            .then((resList) => {
              // Object.keys(resList).forEach((resKey) => {
              //   if (!acc[resKey]) {
              //     acc[resKey] = resList[resKey];
              //   }
              // });
              return resList;
            })
            .catch((err) => {
              // eslint-disable-next-line no-console
              console.warn('Error fetching CRDs for dynamic event sources', err);
            }),
        );
      }
    });
    Promise.all(promiseData)
      .then(([data]) => {
        this.watchedResources = { ...this.watchedResources, ...data };
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.warn('Error fetching CRDs for dynamic event sources', err);
      });
  };

  public updateExtension = (id: string, extension: ModelExtensionContext): void => {
    this.extensions[id] = { ...(this.extensions[id] || {}), ...extension };
    this.updateExtensionsLoaded();
    this.updateWatchedResources();
    this.updateDynamicWatchedResources();
  };

  public getWorkloadResources = (resources: TopologyDataResources): K8sResourceKind[] => {
    const resList = this.watchedResources;
    const kindsMap = Object.keys(resList).reduce((acc, key) => {
      acc[key] = resList[key].kind;
      return acc;
    }, {});
    return getWorkloadResources(resources, kindsMap, this.workloadKeys);
  };

  public get dataModelDepicters(): TopologyDataModelDepicted[] {
    return Object.keys(this.extensions).reduce((acc, key) => {
      if (this.extensions[key].dataModelDepicter) {
        acc.push(this.extensions[key].dataModelDepicter);
      }
      return acc;
    }, []);
  }

  public addDataModel = (model: Model) => {
    addToTopologyDataModel(model, this.model, this.dataModelDepicters);
  };

  public get model(): Model {
    return this.modelP;
  }

  public getExtensionModels = (resources: TopologyDataResources): Promise<Model> => {
    const extensionKeys = Object.keys(this.extensions);
    const getters = extensionKeys.map((key) => this.extensions[key].dataModelGetter);
    const depicters = extensionKeys.map((key) => this.extensions[key].dataModelDepicter);
    const workloadResources = this.getWorkloadResources(resources);
    const promises = getters?.length
      ? getters.map((getter) => getter(this.namespace, resources, workloadResources))
      : [Promise.resolve(null)];

    return Promise.all(promises).then((models) => {
      const topologyModel: Model = {
        nodes: [],
        edges: [],
      };

      models.forEach((model) => {
        if (model) {
          addToTopologyDataModel(model, topologyModel, depicters);
        }
      });
      return topologyModel;
    });
  };
}

const ModelContext = createContext<ExtensibleModel>(null);

export default ModelContext;
