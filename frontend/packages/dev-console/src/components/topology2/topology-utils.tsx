import * as React from 'react';
import { Edge, EdgeEntity, Model, Node, NodeEntity, NodeShape } from '@console/topology/src/types';
import { confirmModal, errorModal } from '@console/internal/components/modals';
import { TopologyDataModel } from '../topology/topology-types';
import {
  createTopologyResourceConnection,
  removeTopologyResourceConnection,
  updateTopologyResourceApplication,
} from '../topology/topology-utils';
import { TYPE_APPLICATION_GROUP } from './consts';

const topologyModelFromDataModel = (dataModel: TopologyDataModel): Model => {
  const nodes: Node[] = dataModel.graph.nodes.map((d) => {
    if (d.type === 'knative-service') {
      return {
        id: d.id,
        type: d.type,
        label: dataModel.topology[d.id].name,
        data: dataModel.topology[d.id],
        children: d.children,
        group: !!d.children,
        shape: NodeShape.rect,
        style: {
          padding: 25,
        },
      };
    }
    return {
      width: 104,
      height: 104,
      id: d.id,
      type: d.type,
      label: dataModel.topology[d.id].name,
      data: dataModel.topology[d.id],
    };
  });

  const groupNodes: Node[] = dataModel.graph.groups.map((d) => {
    return {
      id: d.id,
      group: true,
      type: TYPE_APPLICATION_GROUP,
      data: dataModel.topology[d.id],
      children: d.nodes,
      label: d.name,
      style: {
        padding: 40,
      },
    };
  });

  // create links from data
  const edges = dataModel.graph.edges.map(
    (d): Edge => ({
      data: d,
      source: d.source,
      target: d.target,
      id: `${d.source}_${d.target}`,
      type: d.type,
    }),
  );

  // create topology model
  const model: Model = {
    nodes: [...nodes, ...groupNodes],
    edges,
  };

  return model;
};

const moveNodeToGroup = (node: NodeEntity, targetGroup: NodeEntity) => {
  const sourceGroup =
    node.getParent() !== node.getGraph() ? (node.getParent() as NodeEntity) : undefined;
  if (sourceGroup === targetGroup) {
    return;
  }

  if (sourceGroup) {
    const title = targetGroup ? 'Move Component Node' : 'Remove Component Node from Application';
    const message = (
      <>
        Are you sure you want to {targetGroup ? 'move' : 'remove'}{' '}
        <strong>{node.getLabel()}</strong> from {sourceGroup.getLabel()}
        {targetGroup ? ` to ${targetGroup.getLabel()}` : ''}?
      </>
    );
    const btnText = targetGroup ? 'Move' : 'Remove';

    confirmModal({
      title,
      message,
      btnText,
      executeFn: () => {
        return updateTopologyResourceApplication(
          node.getData(),
          targetGroup ? targetGroup.getLabel() : null,
        ).catch((err) => {
          const error = err.message;
          errorModal({ error });
        });
      },
    });
    return;
  }

  updateTopologyResourceApplication(node.getData(), targetGroup.getLabel()).catch((err) => {
    const error = err.message;
    errorModal({ error });
  });
};

const createConnection = (
  sourceNode: NodeEntity,
  targetNode: NodeEntity,
  replaceTargetNode: NodeEntity = null,
): Promise<any> => {
  return createTopologyResourceConnection(
    sourceNode.getData(),
    targetNode.getData(),
    replaceTargetNode ? replaceTargetNode.getData() : null,
    false,
  );
};

const removeConnection = (edge: EdgeEntity): Promise<any> => {
  const message = (
    <>
      Are you sure you want to remove the connection from{' '}
      <strong>{edge.getSource().getLabel()}</strong> to{' '}
      <strong>{edge.getTarget().getLabel()}</strong>?
    </>
  );

  return confirmModal({
    title: 'Delete Connection',
    message,
    btnText: 'Remove',
    executeFn: () => {
      return removeTopologyResourceConnection(
        edge.getSource().getData(),
        edge.getTarget().getData(),
        edge.getData().sbr,
        edge.getType(),
      ).catch((err) => {
        const error = err.message;
        errorModal({ error });
      });
    },
  });
};

export { topologyModelFromDataModel, moveNodeToGroup, createConnection, removeConnection };
