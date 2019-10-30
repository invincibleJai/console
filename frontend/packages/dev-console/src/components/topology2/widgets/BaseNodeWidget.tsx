import * as React from 'react';
import * as classNames from 'classnames';
import { NodeEntity } from '@console/topology/src/types';
import { WithCreateConnectorProps } from '@console/topology/src/behavior/withCreateConnector';
import { WithDragNodeProps } from '@console/topology/src/behavior/useDragNode';
import { WithSelectionProps } from '@console/topology/src/behavior/useSelection';
import { useAnchor } from '@console/topology/src/behavior/useAnchor';
import EllipseAnchor from '@console/topology/src/anchors/EllipseAnchor';
import { WithDndDropProps } from '@console/topology/src/behavior/useDndDrop';
import { WithContextMenuProps } from '@console/topology/src/behavior/withContextMenu';
import useCombineRefs from '@console/topology/src/utils/useCombineRefs';
import useHover from '@console/topology/src/utils/useHover';
import { createSvgIdUrl } from '../../../utils/svg-utils';
import SvgBoxedText from '../../svg/SvgBoxedText';
import NodeShadows, { NODE_SHADOW_FILTER_ID_HOVER, NODE_SHADOW_FILTER_ID } from './NodeShadows';

import './BaseNodeWidget.scss';

export type BaseNodeProps = {
  outerRadius: number;
  innerRadius?: number;
  icon?: string;
  kind?: string;
  children?: React.ReactNode;
  attachments?: React.ReactNode;
  entity: NodeEntity;
  droppable?: boolean;
  dragging?: boolean;
  edgeDragging?: boolean;
  dropTarget?: boolean;
  canDrop?: boolean;
} & WithSelectionProps &
  WithDragNodeProps &
  WithDndDropProps &
  WithContextMenuProps &
  WithCreateConnectorProps;

const BaseNodeWidget: React.FC<BaseNodeProps> = ({
  outerRadius,
  innerRadius,
  icon,
  kind,
  entity,
  selected,
  onSelect,
  children,
  attachments,
  dragNodeRef,
  dndDropRef,
  droppable,
  canDrop,
  dragging,
  edgeDragging,
  dropTarget,
  onHideCreateConnector,
  onShowCreateConnector,
  onContextMenu,
}) => {
  const [hover, hoverRef] = useHover();
  useAnchor(EllipseAnchor);
  const cx = entity.getBounds().width / 2;
  const cy = entity.getBounds().height / 2;

  const contentsClasses = classNames('odc2-base-node__contents', {
    'is-highlight': canDrop,
    'is-dragging': dragging || edgeDragging,
    'is-hover': (hover && !droppable) || (dropTarget && canDrop),
  });
  const refs = useCombineRefs<SVGEllipseElement>(hoverRef, dragNodeRef);

  React.useLayoutEffect(() => {
    if (hover) {
      onShowCreateConnector();
    } else {
      onHideCreateConnector();
    }
  }, [hover, onShowCreateConnector, onHideCreateConnector]);

  return (
    <g className="odc2-base-node">
      <NodeShadows />
      <g
        data-test-id="base-node-handler"
        onClick={onSelect}
        onContextMenu={onContextMenu}
        ref={refs}
      >
        <circle
          className={classNames('odc2-base-node__bg', { 'is-highlight': canDrop })}
          ref={dndDropRef}
          cx={cx}
          cy={cy}
          r={outerRadius}
          filter={createSvgIdUrl(
            hover || dragging || edgeDragging || dropTarget
              ? NODE_SHADOW_FILTER_ID_HOVER
              : NODE_SHADOW_FILTER_ID,
          )}
        />
        <g className={contentsClasses}>
          <image
            x={cx - innerRadius}
            y={cy - innerRadius}
            width={innerRadius * 2}
            height={innerRadius * 2}
            xlinkHref={icon}
          />
          {(kind || entity.getLabel()) && (
            <SvgBoxedText
              className="odc2-base-node__label"
              x={cx}
              y={cy + outerRadius + 20}
              paddingX={8}
              paddingY={4}
              kind={kind}
              truncate={16}
            >
              {entity.getLabel()}
            </SvgBoxedText>
          )}
          {selected && (
            <circle className="odc2-base-node__selection" cx={cx} cy={cy} r={outerRadius + 1} />
          )}
          {children}
        </g>
      </g>
      <g className={contentsClasses}>{attachments}</g>
    </g>
  );
};

export default BaseNodeWidget;
