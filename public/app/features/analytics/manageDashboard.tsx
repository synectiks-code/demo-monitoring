// Libraries
import React from 'react';
import { connect } from 'react-redux';
import { updateLocation } from 'app/core/actions';
import { CustomNavigationBar } from 'app/core/components/CustomNav';

// Services & Utils
export interface Props {
  $scope: any;
  $injector: any;
  Id?: string;
}

class ManageDashboard extends React.Component<any, any> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <CustomNavigationBar />
        <div>
          <div>
            <h4>AWS - Created by : System Admin</h4>
          </div>
          <div className="row">
            <div className="col-lg-3 col-md-3 col-sm-3"></div>
            <div className="col-lg-9 col-md-9 col-sm-9"></div>
          </div>
        </div>
      </div>
    );
  }
}

export const mapStateToProps = (state: any) => state;

const mapDispatchToProps = {
  updateLocation,
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageDashboard);
