// Libraries
import React from 'react';
import { connect } from 'react-redux';
import { updateLocation } from 'app/core/actions';

// Services & Utils
export interface Props {
  $scope: any;
  $injector: any;
  updateLocation: typeof updateLocation;
  location: any;
}

class TaskManager extends React.Component<any, any> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    return (
      <div>
        <div>jfhbfgbfgbb</div>
      </div>
    );
  }
}

export const mapStateToProps = (state: any) => state;
const mapDispatchToProps = {
  updateLocation,
};

export default connect(mapStateToProps, mapDispatchToProps)(TaskManager);
