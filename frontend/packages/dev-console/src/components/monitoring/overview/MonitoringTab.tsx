import * as React from 'react';
import { OverviewItem } from '@console/shared';
import MonitoringMetricsSection from './MonitoringMetricsSection';

type MonitoringTabProps = {
  item: OverviewItem;
};

const MonitoringTab: React.FC<MonitoringTabProps> = ({ item: { obj: res, pods } }) => {
  return (
    <>
      <MonitoringMetricsSection resource={res} pods={pods} />
    </>
  );
};

export default MonitoringTab;
