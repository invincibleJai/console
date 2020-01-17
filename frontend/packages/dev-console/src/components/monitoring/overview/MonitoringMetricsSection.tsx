import * as React from 'react';
import * as _ from 'lodash';
import { Grid, GridItem } from '@patternfly/react-core';
import { K8sResourceKind } from '@console/internal/module/k8s';
import { SidebarSectionHeading } from '@console/internal/components/utils';
import { requirePrometheus } from '@console/internal/components/graphs';
import MonitoringDashboardGraph from '../dashboard/MonitoringDashboardGraph';
import { workloadMetricQueries } from './queries';

const WorkloadGraphs = requirePrometheus(({ resource }) => {
  const ns = resource.metadata.namespace;
  const workloadName = resource.metadata.name;
  const workloadType = resource.kind.toLowerCase();
  return (
    <>
      <Grid className="co-m-pane__body">
        {_.map(workloadMetricQueries, (q, i) => (
          <GridItem span={12} key={i}>
            <MonitoringDashboardGraph
              title={q.title}
              namespace={ns}
              graphType={q.chartType}
              query={q.query({ ns, workloadName, workloadType })}
              humanize={q.humanize}
              byteDataType={q.byteDataType}
            />
          </GridItem>
        ))}
      </Grid>
    </>
  );
});

type MonitoringMetricsSectionProps = {
  resource: K8sResourceKind;
};

const MonitoringMetricsSection: React.FC<MonitoringMetricsSectionProps> = ({ resource }) => {
  return (
    <>
      <SidebarSectionHeading text="Metrics" />
      <WorkloadGraphs resource={resource} />
    </>
  );
};

export default MonitoringMetricsSection;
