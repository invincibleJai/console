import * as React from 'react';
import { OverviewItem } from '@console/shared';
import MonitoringMetricsSection from './MonitoringMetricsSection';

type MonitoringTabProps = {
  item: OverviewItem;
};

const MonitoringTab: React.FC<MonitoringTabProps> = ({ item }) => {
  const { obj: res } = item;
  return (
    <div className="overview__sidebar-pane-body">
      <MonitoringMetricsSection resource={res} />
    </div>
  );
};

export default MonitoringTab;
