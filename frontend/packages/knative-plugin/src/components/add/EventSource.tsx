import * as React from 'react';
import { Formik } from 'formik';
import { history } from '@console/internal/components/utils';
import { getActiveApplication } from '@console/internal/reducers/ui';
import { RootState } from '@console/internal/redux';
import { connect } from 'react-redux';
import { ALL_APPLICATIONS_KEY } from '@console/internal/const';
// import { K8sResourceKind } from '@console/internal/module/k8s';
import { FirehoseList, Resources } from '@console/dev-console/src/components/import/import-types';
// import { createResources } from './deployImage-submit-utils';
import { eventSourceValidationSchema } from './eventSource-validation-utils';
import EventSourceForm from './EventSourceForm';

export interface EventSourceProps {
  namespace: string;
  projects?: FirehoseList;
}

interface StateProps {
  activeApplication: string;
}

type Props = EventSourceProps & StateProps;

const EventSource: React.FC<Props> = ({ namespace, projects, activeApplication }) => {
  const initialValues = {
    project: {
      name: namespace || '',
      displayName: '',
      description: '',
    },
    application: {
      initial: activeApplication,
      name: activeApplication,
      selectedKey: activeApplication,
    },
    type: 'cronJobSource',
    cronjobsource: {
      data: '',
      schedule: '',
    },
    sink: {
      knativeService: '',
    },
    resources: Resources.Kubernetes,
    limits: {
      cpu: {
        request: '',
        requestUnit: 'm',
        limit: '',
        limitUnit: 'm',
      },
      memory: {
        request: '',
        requestUnit: 'Mi',
        limit: '',
        limitUnit: 'Mi',
      },
    },
  };

  const handleSubmit = (values, actions) => {
    // TODO: handle submit logic
    // const {
    //   project: { name: projectName },
    // } = values;
    // const dryRunRequests: Promise<K8sResourceKind[]> = createResources(values, true);
    // dryRunRequests
    //   .then(() => {
    //     const requests: Promise<K8sResourceKind[]> = createResources(values);
    //     return requests;
    //   })
    //   .then(() => {
    //     actions.setSubmitting(false);
    //     history.push(`/topology/ns/${projectName}`);
    //   })
    //   .catch((err) => {
    //     actions.setSubmitting(false);
    //     actions.setStatus({ submitError: err.message });
    //   });
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      onReset={history.goBack}
      validationSchema={eventSourceValidationSchema}
      render={(props) => <EventSourceForm {...props} projects={projects} />}
    />
  );
};

const mapStateToProps = (state: RootState): StateProps => {
  const activeApplication = getActiveApplication(state);
  return {
    activeApplication: activeApplication !== ALL_APPLICATIONS_KEY ? activeApplication : '',
  };
};

export default connect(mapStateToProps)(EventSource);
