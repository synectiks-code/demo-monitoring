import * as React from 'react';
import { config } from '../config';
import { updateLocation } from 'app/core/actions';
import { connect } from 'react-redux';
import { getLocationSrv } from '@grafana/runtime';

class NewDashboard extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
  }

  closeNewDashboard = () => {
    this.props.closeNewDashboard();
  };

  openNewDashboard = () => {
    getLocationSrv().update({ path: `/dashboard/new?orgId=1` });
  };

  render() {
    return (
      <>
        <div className="newdashboard-container">
          <div className="general-heading">
            <h4>New Dashboard</h4>
            <span className="newdashboard-close">
              <i className="fa fa-close" onClick={this.closeNewDashboard}></i>
            </span>
          </div>
          <div className="general-center-contain">
            <div className="row">
              <div className="col-lg-6 col-md-6 col-sm-12 own-dashboard">
                <div className="d-inline-block" style={{ cursor: 'pointer' }} onClick={this.openNewDashboard}>
                  <span>
                    <img src="/public/img/create-dashboard-image.png" alt="Create your own dashboard" />
                  </span>
                  <label>Create your own dashboard</label>
                </div>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 own-dashboard">
                <a href={`${config.basePath}/managedashboards/importdashboard`}>
                  <span>
                    <img src="/public/img/import-dashboard-image.png" alt="Import Dashboard from Catalog" />
                  </span>
                  <label>Import Dashboard from Catalog</label>
                </a>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export const mapStateToProps = (state: any) => state;

const mapDispatchToProps = {
  updateLocation,
};

export default connect<any, any, any>(mapStateToProps, mapDispatchToProps)(NewDashboard);
