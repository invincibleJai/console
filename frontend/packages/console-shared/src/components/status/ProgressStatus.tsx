import * as React from 'react';
import { InProgressIcon } from '@patternfly/react-icons';
import StatusIconAndText from './StatusIconAndText';

type ProgressStatusProps = {
  title?: string;
  iconOnly?: boolean;
  noTooltip?: boolean;
};

const ProgressStatus: React.FC<ProgressStatusProps> = ({ title, iconOnly, noTooltip = false }) => (
  <StatusIconAndText
    icon={<InProgressIcon />}
    title={title}
    iconOnly={iconOnly}
    noTooltip={noTooltip}
  />
);

export default ProgressStatus;
