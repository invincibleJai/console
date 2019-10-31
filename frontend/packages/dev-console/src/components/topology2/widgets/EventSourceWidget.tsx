import * as React from 'react';
import { getImageForIconClass } from '@console/internal/components/catalog/catalog-item-icon';
import { NodeEntity } from '@console/topology/src/types';
import widget from '@console/topology/src/widget';
import useHover from '@console/topology/src/utils/useHover';
import { WithSelectionProps } from '@console/topology/src/behavior/useSelection';
import { WithContextMenuProps } from '@console/topology/src/behavior/withContextMenu';
import { useSvgAnchor } from '@console/topology/src/behavior/useSvgAnchor';
import useCombineRefs from '@console/topology/src/utils/useCombineRefs';
import { WithDragNodeProps } from '@console/topology/src/behavior/useDragNode';
import { createSvgIdUrl } from '../../../utils/svg-utils';
import SvgBoxedText from '../../svg/SvgBoxedText';
import NodeShadows, { NODE_SHADOW_FILTER_ID_HOVER, NODE_SHADOW_FILTER_ID } from './NodeShadows';

import './EventSourceWidget.scss';

export type EventSourceWidgetProps = {
  entity: NodeEntity;
} & WithSelectionProps &
  WithDragNodeProps &
  WithContextMenuProps;

const EventSourceWidget: React.FC<EventSourceWidgetProps> = ({
  entity,
  selected,
  onSelect,
  onContextMenu,
  dragNodeRef,
}) => {
  const svgAnchorRef = useSvgAnchor();
  const [hover, hoverRef] = useHover();
  const groupRefs = useCombineRefs(dragNodeRef, hoverRef);
  const { width, height } = entity.getBounds();
  const size = Math.min(width, height);
  const { data } = entity.getData();
  const getImageIcon = () => {
    switch (data.kind) {
      case 'CronJobSource':
        return 'icon-cronjobsource';
      case 'ApiServerSource':
        return 'icon-apiserversource';
      default:
        return 'icon-openshift';
    }
  };

  return (
    <g onClick={onSelect} onContextMenu={onContextMenu} ref={groupRefs}>
      <NodeShadows />
      <polygon
        className="odc-event-source"
        ref={svgAnchorRef}
        filter={createSvgIdUrl(hover ? NODE_SHADOW_FILTER_ID_HOVER : NODE_SHADOW_FILTER_ID)}
        points={`${width / 2}, ${(height - size) / 2} ${width - (width - size) / 2},${height /
          2} ${width / 2},${height - (height - size) / 2} ${(width - size) / 2},${height / 2}`}
      />

      {selected && (
        <polygon
          className="odc-event-source__selection"
          points={`${width / 2}, ${(height - size) / 2 - 2} ${width -
            (width - size) / 2 +
            2},${height / 2} ${width / 2},${height - (height - size) / 2 + 2} ${(width - size) / 2 -
            2},${height / 2}`}
        />
      )}
      <image
        x={width * 0.25}
        y={height * 0.25}
        width={size * 0.5}
        height={size * 0.5}
        xlinkHref={getImageForIconClass(getImageIcon())}
      />
      {(data.kind || entity.getLabel()) && (
        <SvgBoxedText
          className="odc-base-node__label"
          x={width / 2}
          y={(height + size) / 2 + 20}
          paddingX={8}
          paddingY={4}
          kind={data.kind}
          truncate={16}
        >
          {entity.getLabel()}
        </SvgBoxedText>
      )}
    </g>
  );
};

export default widget(EventSourceWidget);
