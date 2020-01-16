import * as React from 'react';
import * as _ from 'lodash';
import {
  Accordion,
  AccordionItem,
  AccordionToggle,
  AccordionContent,
  Grid,
  GridItem,
} from '@patternfly/react-core';
import { K8sResourceKind, PodKind } from '@console/internal/module/k8s';
import { requirePrometheus } from '@console/internal/components/graphs';
import { workloadMetricQueries } from './queries';
import MonitoringDashboardGraph from '../dashboard/MonitoringDashboardGraph';
import MonitoringOverviewSection from './MonitoringOverviewSection';
import './MonitoringSection.scss';

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
  pods: PodKind[];
};

const MonitoringMetricsSection: React.FC<MonitoringMetricsSectionProps> = ({ resource, pods }) => {
  const [expanded, setExpanded] = React.useState();

  const onToggle = (id) => {
    if (id === expanded) {
      setExpanded('');
    } else {
      setExpanded(id);
    }
  };

  return (
    <>
      <div className="odc-monitoring-sections">
        <MonitoringOverviewSection type="alerts" pods={pods} />
        <Accordion
          asDefinitionList={false}
          noBoxShadow
          className="odc-monitoring-sections__metric-accordion"
          headingLevel="h5"
        >
          <AccordionItem>
            <AccordionToggle
              onClick={() => {
                onToggle('metrics');
              }}
              isExpanded={expanded === 'metrics'}
              id="metrics"
            >
              Metrics
            </AccordionToggle>
            <AccordionContent id="metrics" isHidden={expanded !== 'metrics'}>
              <WorkloadGraphs resource={resource} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <MonitoringOverviewSection type="events" pods={pods} />
      </div>
    </>
  );
};

export default MonitoringMetricsSection;
