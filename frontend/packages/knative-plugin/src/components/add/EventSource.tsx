import * as React from 'react';
import * as _ from 'lodash';
import { safeLoad } from 'js-yaml';
import { Formik } from 'formik';
import { connect } from 'react-redux';
import { chart_color_red_300 as knativeEventingColor } from '@patternfly/react-tokens';
import { history } from '@console/internal/components/utils';
import { getActiveApplication } from '@console/internal/reducers/ui';
import { RootState } from '@console/internal/redux';
import { K8sKind } from '@console/internal/module/k8s';
import { ALL_APPLICATIONS_KEY } from '@console/shared';
import { K8sResourceKind, modelFor, referenceFor, k8sCreate } from '@console/internal/module/k8s';
import { FirehoseList } from '@console/dev-console/src/components/import/import-types';
import { sanitizeApplicationValue } from '@console/dev-console/src/utils/application-utils';
import { eventSourceValidationSchema } from './eventSource-validation-utils';
import EventSourceForm from './EventSourceForm';
import { EventSources, EventSourceFormData } from './import-types';
import {
  getEventSourcesDepResource,
  getEventSourceData,
} from '../../utils/create-eventsources-utils';

interface EventSourceProps {
  namespace: string;
  projects?: FirehoseList;
  contextSource?: string;
  selectedApplication?: string;
  customresourcedefinition?: FirehoseList;
}

interface StateProps {
  activeApplication: string;
}

type Props = EventSourceProps & StateProps;

const EventSource: React.FC<Props> = ({
  namespace,
  projects,
  activeApplication,
  contextSource,
  customresourcedefinition,
}) => {
  const typeEventSource = EventSources.CronJobSource;
  const serviceName = contextSource?.split('/').pop() || '';
  //   project,
  //   customresourcedefinition,
  //   activeApplication,
  // }) => {
  console.log('customresourcedefinition', customresourcedefinition);
  const eventSourceModelList: K8sKind[] = _.map(customresourcedefinition?.data, (crd) => {
    const {
      spec: { group, version, names },
    } = crd;
    return {
      apiGroup: group,
      apiVersion: version,
      kind: names?.kind,
      plural: names?.plural,
      id: names?.singular,
      label: names?.singular,
      labelPlural: names?.plural,
      abbr: names?.kind?.replace(/[a-z]/g, ''),
      namespaced: true,
      crd: true,
      color: knativeEventingColor.value,
    };
  });
  const typeEventSource = EventSources.CronJobSource;
  const selDataModel = _.find(eventSourceModelList, { kind: typeEventSource });
  const selApiVersion = selDataModel
    ? selDataModel['apiGroup'] + '/' + selDataModel['apiVersion']
    : 'sources.knative.dev/v1alpha1';
  const initialValues: EventSourceFormData = {
    project: {
      name: namespace || '',
      displayName: '',
      description: '',
    },
    application: {
      initial: sanitizeApplicationValue(activeApplication),
      name: sanitizeApplicationValue(activeApplication),
      selectedKey: activeApplication,
    },
    name: '',
    sink: {
      knativeService: serviceName,
    },
    type: typeEventSource,
    apiVersion: selApiVersion || '',
    data: {
      [typeEventSource.toLowerCase()]: getEventSourceData(typeEventSource.toLowerCase()),
    },
    chartValuesYAML: '',
  };

  const createResources = (rawFormData: any, yamlData = false): Promise<K8sResourceKind> => {
    const knEventSourceResource = yamlData ? rawFormData : getEventSourcesDepResource(rawFormData);
    return k8sCreate(modelFor(referenceFor(knEventSourceResource)), knEventSourceResource);
  };

  const handleSubmit = (values, actions) => {
    const {
      project: { name: projectName },
      chartValuesYAML,
    } = values;
    let valuesObj;
    if (chartValuesYAML) {
      try {
        valuesObj = safeLoad(chartValuesYAML);
      } catch (err) {
        actions.setStatus({ submitError: `Invalid YAML - ${err}` });
        return;
      }
    }
    const eventSrcRequest: Promise<K8sResourceKind> = valuesObj
      ? createResources(valuesObj, true)
      : createResources(values);
    eventSrcRequest
      .then(() => {
        actions.setSubmitting(false);
        history.push(`/topology/ns/${projectName}`);
      })
      .catch((err) => {
        actions.setSubmitting(false);
        actions.setStatus({ submitError: err.message });
      });
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      onReset={history.goBack}
      validationSchema={eventSourceValidationSchema}
    >
      {(props) => (
        <EventSourceForm
          {...props}
          namespace={namespace}
          projects={project}
          eventSourceModelList={eventSourceModelList}
          eventSourceLoadError={customresourcedefinition?.loadError !== ''}
        />
      )}
    </Formik>
  );
};

const mapStateToProps = (state: RootState, ownProps: EventSourceProps): StateProps => {
  const activeApplication = ownProps.selectedApplication || getActiveApplication(state);
  return {
    activeApplication: activeApplication !== ALL_APPLICATIONS_KEY ? activeApplication : '',
  };
};

export default connect(mapStateToProps)(EventSource);
