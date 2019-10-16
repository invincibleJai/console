import * as React from 'react';
import { action } from 'mobx';
import { observer } from 'mobx-react';
import EntityContext from '../utils/EntityContext';
import { EventListener, isNodeEntity } from '../types';
import { useDndDrag, WithDndDragProps } from './useDndDrag';
import {
  DragSourceSpec,
  DragEvent,
  ConnectDragSource,
  DragObjectWithType,
  DragSourceMonitor,
} from './dnd-types';

export const DRAG_NODE_EVENT = 'drag_node';
export const DRAG_NODE_START_EVENT = `${DRAG_NODE_EVENT}_start`;
export const DRAG_NODE_END_EVENT = `${DRAG_NODE_EVENT}_end`;

//                                                 id,     x,      y,      dx,     dy
export type DragNodeEventListener = EventListener<[string, number, number, number, number]>;

export const useDragNode = <DropResult, CollectedProps, Props = {}>(
  spec?: Omit<DragSourceSpec<DragObjectWithType, DropResult, CollectedProps>, 'type'>,
  props?: Props,
): [CollectedProps, ConnectDragSource] => {
  const entity = React.useContext(EntityContext);
  if (!isNodeEntity(entity)) {
    throw new Error('useDragNode must be used within the scope of a NodeEntity');
  }
  const entityRef = React.useRef(entity);
  entityRef.current = entity;
  const id = entity.getId();
  return useDndDrag(
    React.useMemo(() => {
      const sourceSpec: DragSourceSpec<any, any, any, Props> = {
        item: { type: '#useDragNode#' },
        begin: action((monitor: DragSourceMonitor, p: Props) => {
          entityRef.current.raise();
          if (entityRef.current.isGroup()) {
            entityRef.current.getChildren().forEach((c) => {
              c.raise();
            });
          }

          spec && spec.begin && spec.begin(monitor, p);

          entityRef.current.getController().fireEvent(DRAG_NODE_START_EVENT, id);

          // always return the entity as drag item
          return entityRef.current;
        }),
        drag: action((event: DragEvent, monitor: DragSourceMonitor, p: Props) => {
          const { x, y, dx, dy } = event;
          if (entityRef.current.isGroup()) {
            entityRef.current.getChildren().forEach((c) => {
              if (isNodeEntity(c)) {
                c.getBounds().translate(dx, dy);
              }
            });
          } else {
            entityRef.current.getBounds().translate(dx, dy);
          }
          spec && spec.drag && spec.drag(event, monitor, p);
          entityRef.current.getController().fireEvent(DRAG_NODE_START_EVENT, id, x, y, dx, dy);
        }),
        canDrag: spec ? spec.canDrag : undefined,
        end: action(() => {
          entityRef.current.getController().fireEvent(DRAG_NODE_END_EVENT, id);
          return spec ? spec.end : undefined;
        }),
        collect: spec ? spec.collect : undefined,
      };
      return sourceSpec;
    }, [id, spec]),
    props,
  );
};

export type WithDragNodeProps = {
  dragNodeRef: WithDndDragProps['dndDragRef'];
};

export const withDragNode = <DropResult, CollectedProps, Props = {}>(
  spec?: Omit<DragSourceSpec<DragObjectWithType, DropResult, CollectedProps, Props>, 'type'>,
) => <P extends WithDragNodeProps & CollectedProps & Props>(
  WrappedComponent: React.ComponentType<P>,
) => {
  const Component: React.FC<Omit<P, keyof WithDragNodeProps>> = (props) => {
    const [dragNodeProps, dragNodeRef] = useDragNode(spec, props);
    return <WrappedComponent {...props as any} dragNodeRef={dragNodeRef} {...dragNodeProps} />;
  };
  return observer(Component);
};
