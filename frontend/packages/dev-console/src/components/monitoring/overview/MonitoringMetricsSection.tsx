import * as React from 'react';
import * as _ from 'lodash';
import { Grid, GridItem } from '@patternfly/react-core';
import { K8sResourceKind, PodKind } from '@console/internal/module/k8s';
import { Firehose } from '@console/internal/components/utils';
import { requirePrometheus } from '@console/internal/components/graphs';
import { EventModel } from '@console/internal/models';
import { getActiveNamespace } from '@console/internal/actions/ui';
import MonitoringDashboardGraph from '../dashboard/MonitoringDashboardGraph';
import { workloadMetricQueries } from './queries';
import MonitoringEvent from './MonitoringEvents';
import MonitoringAlerts from './MonitoringAlerts';

const WorkloadGraphs = requirePrometheus(({ deployment }) => {
  const ns = deployment.metadata.namespace;
  const workloadName = deployment.metadata.name;
  const workloadType = deployment.kind.toLowerCase();
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

const MonitoringMetricsSection: React.FC<MonitoringMetricsSectionProps> = ({
  deployment,
  pods,
}) => {
  return (
    <>
      <Firehose
        resources={[
          {
            isList: true,
            kind: EventModel.kind,
            prop: 'events',
            namespace: getActiveNamespace(),
          },
        ]}
      >
        <MonitoringAlerts pods={pods} />
      </Firehose>
      <h2>Metrics</h2>
      <WorkloadGraphs deployment={deployment} />
      <Firehose
        resources={[
          {
            isList: true,
            kind: EventModel.kind,
            prop: 'events',
            namespace: getActiveNamespace(),
          },
        ]}
      >
        <MonitoringEvent pods={pods} />
      </Firehose>
    </>
  );
};

type MonitoringMetricsSectionProps = {
  deployment: K8sResourceKind;
  pods: PodKind[];
};

export default MonitoringMetricsSection;
