import * as React from 'react';
import { DeploymentKind } from '@console/internal/module/k8s';
import { OverviewItem } from '@console/shared';
import MonitoringMetricsSection from './MonitoringMetricsSection';

const MonitoringTab: React.FC<MonitoringTabProps> = ({ item: { obj: d, pods } }) => {
  return (
    <div>
      {(d.kind === 'Deployment' || d.kind === 'StatefulSet' || d.kind === 'DaemonSet') && (
        <MonitoringMetricsSection deployment={d} pods={pods} />
      )}
    </div>
  );
};

type MonitoringTabProps = {
  item: OverviewItem<DeploymentKind>;
};

export default MonitoringTab;
