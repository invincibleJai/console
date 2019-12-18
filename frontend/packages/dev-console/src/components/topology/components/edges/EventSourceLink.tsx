import * as React from 'react';
import {
  Edge,
  observer,
  WithSourceDragProps,
  WithTargetDragProps,
  WithRemoveConnectorProps,
  EdgeConnectorArrow,
} from '@console/topology';
import BaseEdge from './BaseEdge';
import './EventSourceLink.scss';

type ConnectsToProps = {
  element: Edge;
  dragging?: boolean;
} & WithSourceDragProps &
  WithTargetDragProps &
  WithRemoveConnectorProps;

const ConnectsTo: React.FC<ConnectsToProps> = ({ element, targetDragRef, children, ...others }) => {
  const markerPoint = element.getEndPoint();
  return (
    <BaseEdge className="odc-event-source-link" element={element} {...others}>
      {/* <EdgeConnectorArrow dragRef={targetDragRef} edge={element} />
      {children} */}
      <circle ref={targetDragRef} cx={markerPoint.x} cy={markerPoint.y} r={6} />
    </BaseEdge>
  );
};

export default observer(ConnectsTo);
