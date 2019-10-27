import * as React from 'react';
import {
  TopologyView,
  TopologyControlBar,
  createTopologyControlButtons,
  defaultControlButtonsOptions,
} from '@patternfly/react-topology';
import Visualization from '@console/topology/src/Visualization';
import VisualizationWidget from '@console/topology/src/VisualizationWidget';
import { ElementEntity, isNodeEntity, Model } from '@console/topology/src/types';
import {
  SELECTION_EVENT,
  SelectionEventListener,
} from '@console/topology/src/behavior/useSelection';
import * as _ from 'lodash';
import TopologySideBar from '../topology/TopologySideBar';
import { TopologyDataModel, TopologyDataObject } from '../topology/topology-types';
import TopologyResourcePanel from '../topology/TopologyResourcePanel';
import TopologyApplicationPanel from '../topology/TopologyApplicationPanel';
import { topologyModelFromDataModel } from './topology-utils';
import layoutFactory from './layoutFactory';
import widgetFactory from './widgetFactory';

export interface TopologyProps {
  data: TopologyDataModel;
}

const graphModel: Model = {
  graph: {
    id: 'g1',
    type: 'graph',
    layout: 'Force',
  },
};

const Topology: React.FC<TopologyProps> = ({ data }) => {
  const visRef = React.useRef<Visualization | null>(null);
  const [model, setModel] = React.useState<Model>();
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);

  if (!visRef.current) {
    visRef.current = new Visualization();
    visRef.current.registerLayoutFactory(layoutFactory);
    visRef.current.registerWidgetFactory(widgetFactory);
    visRef.current.addEventListener<SelectionEventListener>(SELECTION_EVENT, setSelectedIds);
    visRef.current.fromModel(graphModel);
  }

  React.useEffect(() => {
    const newModel = topologyModelFromDataModel(data);
    visRef.current.fromModel(newModel);
    setModel(newModel);
    if (selectedIds.length && !visRef.current.getController().getEntityById(selectedIds[0])) {
      setSelectedIds([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  React.useEffect(() => {
    let resizeTimeout = null;
    if (selectedIds.length > 0) {
      const selectedEntity = visRef.current.getController().getEntityById(selectedIds[0]);
      if (selectedEntity && isNodeEntity(selectedEntity)) {
        resizeTimeout = setTimeout(() => {
          visRef.current.getRoot().panIntoView(selectedEntity, { offset: 20, minimumVisible: 40 });
          resizeTimeout = null;
        }, 500);
      }
    }
    return () => {
      if (resizeTimeout) {
        resizeTimeout.cancel();
      }
    };
  }, [selectedIds]);

  const onSidebarClose = () => {
    setSelectedIds([]);
  };

  const renderControlBar = () => {
    return (
      <TopologyControlBar
        controlButtons={createTopologyControlButtons({
          ...defaultControlButtonsOptions,
          zoomInCallback: () => {
            visRef.current.getRoot().scaleBy(4 / 3);
          },
          zoomOutCallback: () => {
            visRef.current.getRoot().scaleBy(0.75);
          },
          fitToScreenCallback: () => {
            visRef.current.getRoot().fit(80);
          },
          resetViewCallback: () => {
            visRef.current.getRoot().reset();
            visRef.current.getRoot().layout();
          },
          legend: false,
        })}
      />
    );
  };

  const selectedItemDetails = () => {
    const selectedEntity = selectedIds[0]
      ? visRef.current.getController().getEntityById(selectedIds[0])
      : null;
    if (isNodeEntity(selectedEntity)) {
      if (selectedEntity.isGroup()) {
        return (
          <TopologyApplicationPanel
            application={{
              id: selectedEntity.getId(),
              name: selectedEntity.getLabel(),
              resources: _.map(selectedEntity.getChildren(), (node: ElementEntity) =>
                node.getData(),
              ),
            }}
          />
        );
      }
      return <TopologyResourcePanel item={selectedEntity.getData() as TopologyDataObject} />;
    }

    return null;
  };

  const renderSideBar = () => {
    if (selectedIds.length === 0) {
      return null;
    }
    const selectedEntity = visRef.current.getController().getEntityById(selectedIds[0]);
    if (!selectedEntity) {
      return null;
    }
    return (
      <TopologySideBar show={!!selectedEntity} onClose={onSidebarClose}>
        {selectedEntity && selectedItemDetails()}
      </TopologySideBar>
    );
  };

  if (!model) {
    return null;
  }

  return (
    <TopologyView
      controlBar={renderControlBar()}
      sideBar={renderSideBar()}
      sideBarOpen={selectedIds.length > 0}
    >
      <VisualizationWidget visualization={visRef.current} state={{ selectedIds }} />
    </TopologyView>
  );
};

export default Topology;
