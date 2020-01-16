import * as React from 'react';
import * as _ from 'lodash';
import {
  Alert,
  Accordion,
  AccordionItem,
  AccordionToggle,
  AccordionContent,
} from '@patternfly/react-core';
import { fromNow } from '@console/internal/components/utils/datetime';
import { getPodsEvents } from '../monitoring-utils';
import './MonitoringEvent.scss';

const MonitoringEvent = (props) => {
  const events = getPodsEvents(props.pods, props.events.data);

  const [expanded, setExpanded] = React.useState();

  const onToggle = (id) => {
    if (id === expanded) {
      setExpanded('');
    } else {
      setExpanded(id);
    }
  };

  return (
    <div className="odc-monitoring-event">
      <Accordion
        asDefinitionList={false}
        noBoxShadow
        className="odc-monitoring-event__event-accordion"
        headingLevel="h5"
      >
        <AccordionItem>
          <AccordionToggle
            onClick={() => {
              onToggle('events');
            }}
            isExpanded={expanded === 'events'}
            id="events"
          >
            Events
          </AccordionToggle>
          <AccordionContent id="events" isHidden={expanded !== 'events'}>
            {!_.isEmpty(events[0]) ? (
              _.map(events[0], (event: any, i) => {
                return (
                  <Alert variant="warning" isInline title={event.reason} key={i}>
                    {event.message}
                    <div className="odc-monitoring-event__timestamp">
                      <small className="text-secondary">{fromNow(event.lastTimestamp)}</small>
                    </div>
                  </Alert>
                );
              })
            ) : (
              <div className="text-secondary">There are no recent events.</div>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default MonitoringEvent;
