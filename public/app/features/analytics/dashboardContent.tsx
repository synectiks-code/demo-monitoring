// Libraries
import React from 'react';

// Services & Utils
export interface Props {
  $scope: any;
  $injector: any;
}

class DashboardContent extends React.Component<any, any> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }
  render() {
    const { dashbordData } = this.props;
    return <div>{JSON.stringify(dashbordData)}</div>;
  }
}

export default DashboardContent;
