import * as React from 'react';
import {
  BitbucketIcon,
  GitAltIcon,
  GithubIcon,
  GitlabIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from '@patternfly/react-icons';
import {
  global_danger_color_100 as dangerColor,
  global_success_color_200 as okColor,
} from '@patternfly/react-tokens';
import CheIcon from '../topology/components/nodes/CheIcon';
import { detectGitType } from './import-validation-utils';
import { GitTypes } from './import-types';

export const routeDecoratorIcon = (
  routeURL: string,
  radius: number,
  cheEnabled?: boolean,
): React.ReactElement => {
  if (cheEnabled && routeURL) {
    return <CheIcon style={{ fontSize: radius }} />;
  }
  switch (detectGitType(routeURL)) {
    case GitTypes.invalid:
      // Not a valid url and thus not safe to use
      return null;
    case GitTypes.github:
      return <GithubIcon style={{ fontSize: radius }} alt="Edit Source Code" />;
    case GitTypes.bitbucket:
      return <BitbucketIcon style={{ fontSize: radius }} alt="Edit Source Code" />;
    case GitTypes.gitlab:
      return <GitlabIcon style={{ fontSize: radius }} alt="Edit Source Code" />;
    default:
      return <GitAltIcon style={{ fontSize: radius }} alt="Edit Source Code" />;
  }
};

export const getMonitoringDecoratorIcon = (status: string, radius: number): React.ReactElement => {
  switch (status) {
    case 'Normal':
      return (
        <CheckCircleIcon color={okColor.value} style={{ fontSize: radius }} alt="Monitoring" />
      );
    case 'Warning':
      return (
        <ExclamationCircleIcon
          color={dangerColor.value}
          style={{ fontSize: radius }}
          alt="Monitoring"
        />
      );
    default:
      return null;
  }
};
