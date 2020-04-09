import * as React from 'react';
import * as _ from 'lodash';
import { safeLoad } from 'js-yaml';
import { Formik } from 'formik';
import { connect } from 'react-redux';
import { history } from '@console/internal/components/utils';
import { getActiveApplication } from '@console/internal/reducers/ui';
import { RootState } from '@console/internal/redux';
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
import { eventSourceModels } from '../../utils/fetch-dynamic-sources-utils';

interface EventSourceProps {
  namespace: string;
  projects?: FirehoseList;
  contextSource?: string;
  selectedApplication?: string;
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
}) => {
  const serviceName = contextSource?.split('/').pop() || '';
  const typeEventSource = EventSources.CronJobSource;
  const selDataModel = _.find(eventSourceModels, { kind: typeEventSource });
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
          projects={projects}
          eventSourceModelList={eventSourceModels}
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
