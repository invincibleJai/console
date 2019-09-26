import * as React from 'react';
import { GraphEntity } from '../types';
import widget from './widget';
import EntityWidget from './EntityWidget';

type GraphWidgetProps = {
  entity: GraphEntity;
};

const GraphWidget: React.FC<GraphWidgetProps> = ({ entity }) => (
  <svg style={{ width: '100%', height: '100%', flexGrow: 1, flexShrink: 1 }}>
    {entity.getNodes().map((e) => (
      <EntityWidget key={e.getId()} entity={e} />
    ))}
    {entity.getEdges().map((e) => (
      <EntityWidget key={e.getId()} entity={e} />
    ))}
  </svg>
);

export default widget(GraphWidget);
