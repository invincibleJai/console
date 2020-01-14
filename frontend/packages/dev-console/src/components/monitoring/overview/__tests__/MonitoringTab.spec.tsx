import * as React from 'react';
import { shallow } from 'enzyme';
import MonitoringTab from '../MonitoringTab';
import MonitoringMetricsSection from '../MonitoringMetricsSection';

describe('Monitoring Tab', () => {
  const monTabProps: React.ComponentProps<typeof MonitoringTab> = {
    item: {
      obj: {
        metadata: {
          name: 'workload-name',
          namespace: 'test',
        },
        kind: 'Deployment',
        status: {},
        spec: {
          selector: {},
          template: {
            metadata: {},
            spec: {
              containers: [],
            },
          },
        },
      },
      buildConfigs: [],
      routes: [],
      services: [],
    },
  };

  it('should render Monitoring tab for workload of type Deployment', () => {
    const component = shallow(<MonitoringTab {...monTabProps} />);
    expect(component.find(MonitoringMetricsSection).exists()).toBe(true);
  });
  it('should render Monitoring tab for workload of type DaemonSet', () => {
    monTabProps.item.obj.kind = 'DaemonSet';
    const component = shallow(<MonitoringTab {...monTabProps} />);
    expect(component.find(MonitoringMetricsSection).exists()).toBe(true);
  });
  it('should render Monitoring tab for workload of type StatefulSet', () => {
    monTabProps.item.obj.kind = 'StatefulSet';
    const component = shallow(<MonitoringTab {...monTabProps} />);
    expect(component.find(MonitoringMetricsSection).exists()).toBe(true);
  });
});
