import * as React from 'react';
import { shallow } from 'enzyme';
import { SidebarSectionHeading } from '@console/internal/components/utils';
import MonitoringMetricsSection from '../MonitoringMetricsSection';

describe('Monitoring Metric Section', () => {
  let metSecProps: React.ComponentProps<typeof MonitoringMetricsSection>;

  it('should render Metric Section for workload of type Deployment', () => {
    metSecProps = {
      deployment: {
        metadata: {
          name: 'workload-name',
          namespace: 'test',
        },
        spec: {},
        status: {},
        kind: 'Deployment',
      },
    };
    const component = shallow(<MonitoringMetricsSection {...metSecProps} />);
    expect(component.find(SidebarSectionHeading).exists()).toBe(true);
    expect(component.find(SidebarSectionHeading).prop('text')).toBe('Metrics');
  });
});
