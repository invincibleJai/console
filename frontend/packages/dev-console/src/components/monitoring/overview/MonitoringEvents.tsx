import * as React from 'react';
import * as _ from 'lodash';
import {
  Accordion,
  AccordionItem,
  AccordionToggle,
  AccordionContent,
  Flex,
  FlexItem,
  FlexModifiers,
} from '@patternfly/react-core';
import { twentyFourHourTime } from '@console/internal/components/utils/datetime';
import { YellowExclamationTriangleIcon } from '@console/shared';
import { referenceFor } from '@console/internal/module/k8s';
import { ResourceLink } from '@console/internal/components/utils';
import { getPodsEvents } from '../monitoring-utils';
import './MonitoringEvents.scss';

const MonitoringEvents = (props) => {
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
                  <div className="odc-monitoring-event__event-item" key={i}>
                    <Flex breakpointMods={[{ modifier: FlexModifiers['align-self-baseline'] }]}>
                      <FlexItem title={event.lastTimestamp} className="text-secondary">
                        {twentyFourHourTime(new Date(event.lastTimestamp))}
                      </FlexItem>
                      {event.type === 'Warning' && (
                        <FlexItem>
                          <YellowExclamationTriangleIcon className="odc-monitoring-event__warning-icon" />
                        </FlexItem>
                      )}
                      <FlexItem>
                        <ResourceLink
                          className="co-recent-item__content-resourcelink"
                          kind={referenceFor(event.involvedObject)}
                          namespace={event.involvedObject.namespace}
                          name={event.involvedObject.name}
                          title={event.involvedObject.uid}
                        />
                      </FlexItem>
                    </Flex>
                    <div className="odc-monitoring-event__event-message">{event.message}</div>
                  </div>
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

export default MonitoringEvents;
