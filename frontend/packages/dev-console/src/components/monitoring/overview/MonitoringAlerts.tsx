import * as React from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionToggle,
  Split,
  SplitItem,
  Badge,
  AccordionContent,
  Alert,
} from '@patternfly/react-core';
import * as _ from 'lodash';
import { fromNow } from '@console/internal/components/utils/datetime';
import { getAlerts } from '../monitoring-utils';
import './MonitoringAlerts.scss';

const MonitoringAlerts = (props) => {
  const alerts = getAlerts(props.pods, props.events.data);

  const [expanded, setExpanded] = React.useState();

  const onToggle = (id) => {
    if (id === expanded) {
      setExpanded('');
    } else {
      setExpanded(id);
    }
  };

  return (
    <Accordion
      asDefinitionList={false}
      noBoxShadow
      className="odc-monitoring-alerts__alerts-accordion"
      headingLevel="h5"
    >
      <AccordionItem>
        <AccordionToggle
          onClick={() => {
            onToggle('alert');
          }}
          isExpanded={expanded === 'alert'}
          id="alert"
        >
          <Split>
            <SplitItem>Alerts</SplitItem>
            <SplitItem isFilled />
            <SplitItem>
              <Badge key={1}>{alerts.length}</Badge>
            </SplitItem>
          </Split>
        </AccordionToggle>
        <AccordionContent id="alert" isHidden={expanded !== 'alert'}>
          {!_.isEmpty(alerts) ? (
            _.map(alerts, (alert: any, i) => {
              return (
                <Alert variant="warning" isInline title={alert.reason} key={i}>
                  {alert.message}
                  <div className="odc-monitoring-alerts__timestamp">
                    <small className="text-secondary">{fromNow(alert.lastTimestamp)}</small>
                  </div>
                </Alert>
              );
            })
          ) : (
            <div className="text-secondary">There are no alerts.</div>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default MonitoringAlerts;
