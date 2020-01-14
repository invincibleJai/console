import * as React from 'react';
import { DeploymentKind } from '@console/internal/module/k8s';
import { OverviewItem } from '@console/shared';
import MonitoringMetricsSection from './MonitoringMetricsSection';

const MonitoringTab: React.FC<MonitoringTabProps> = ({ item }) => {
  const { obj: d } = item;
  return (
    <div className="overview__sidebar-pane-body">
      {(d.kind === 'Deployment' || d.kind === 'StatefulSet' || d.kind === 'DaemonSet') && (
        <MonitoringMetricsSection deployment={d} />
      )}
    </div>
  );
};

type MonitoringTabProps = {
  item: OverviewItem<DeploymentKind>;
};

export default MonitoringTab;
