import * as React from 'react';
import * as _ from 'lodash';

import { Loading } from '@console/internal/components/utils';
import { useFormikContext, FormikValues } from 'formik';

const LoadingDisplay: React.FC = () => {
  const { values, errors } = useFormikContext<FormikValues>();
  const isiError = _.get(errors, 'isi.image');

  return (
    <div>
      {_.isEmpty(values.isi.image) && (
        <div className="co-image-name-results">
          <div className="co-image-name-results__loading">
            {values.loading && <Loading className="co-m-loader--inline" />}
            {!values.loading && !isiError && (
              <h2 className="h3 co-image-name-results__loading-heading">
                {/* Select an image stream tag or e */}Enter an image name.
              </h2>
            )}
            {!values.loading && isiError && (
              <React.Fragment>
                <h2 className="h3 co-image-name-results__loading-heading">
                  <i className="pficon pficon-error-circle-o" aria-hidden="true" /> Could not load
                  image metadata.
                </h2>
                <p className="co-image-name-results__loading-error">{isiError}</p>
              </React.Fragment>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LoadingDisplay;
