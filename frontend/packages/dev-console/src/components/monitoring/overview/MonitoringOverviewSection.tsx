import * as React from 'react';
import { RootState } from '@console/internal/redux';
import { getActiveNamespace } from '@console/internal/reducers/ui';
import { connect } from 'react-redux';
import { EventModel } from '@console/internal/models';
import { Firehose } from '@console/internal/components/utils';
import { PodKind } from '@console/internal/module/k8s';
import MonitoringEvents from './MonitoringEvents';
import MonitoringAlerts from './MonitoringAlerts';

interface MonitoringOverviewSectionProps {
  type: string;
  namespace: string;
  pods: PodKind[];
}

const MonitoringOverviewSection: React.FC<MonitoringOverviewSectionProps> = ({
  type,
  namespace,
  pods,
}) => {
  return (
    <Firehose
      resources={[
        {
          isList: true,
          kind: EventModel.kind,
          prop: 'events',
          namespace,
        },
      ]}
    >
      {type === 'events' && <MonitoringEvents pods={pods} />}
      {type === 'alerts' && <MonitoringAlerts pods={pods} />}
    </Firehose>
  );
};

const mapStateToProps = (state: RootState) => ({
  namespace: getActiveNamespace(state),
});

export default connect(mapStateToProps)(MonitoringOverviewSection);
