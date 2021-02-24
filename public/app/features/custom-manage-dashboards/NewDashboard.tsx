import * as React from 'react';
import { config } from '../config';

export class NewDashboard extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      newDashboard: false,
    };
  }

  closenewDashboard = () => {
    this.props.closenewDashboard();
  };

  openNewDashboard = () => {
    let page = !this.state.newDashboard;
    this.setState({
      newDashboard: page,
    });
  };

  render() {
    const { newDashboard } = this.state;
    return (
      <>
        {newDashboard === false && (
          <div className="newdashboard-container">
            <div className="general-heading">
              <h4>New Dashboard</h4>
              <span className="newdashboard-close">
                <i className="fa fa-close" onClick={this.closenewDashboard}></i>
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
                  <a href={`${config.basePath}/plugins/xformation-perfmanager-ui-plugin/page/newcatalog`}>
                    <span>
                      <img src="/public/img/import-dashboard-image.png" alt="Import Dashboard from Catalog" />
                    </span>
                    <label>Import Dashboard from Catalog</label>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
        {newDashboard === true && (
          <div className="createnewdashboard-container">
            <div className="general-heading">
              <h4>Create New Dashboard</h4>
              <span className="newdashboard-close">
                <i className="fa fa-close" onClick={this.closenewDashboard}></i>
              </span>
            </div>
            <div className="create-dashboard">
              <div className="d-block" style={{ marginBottom: '50px' }}>
                <a
                  className="dashboard-blue-button"
                  href={`${config.basePath}plugins/xformation-perfmanager-ui-plugin/page/createnewdashboard`}
                >
                  <i className="fa fa-plus"></i> Add New Panel
                </a>
              </div>
              <div className="d-block">
                <a className="dashboard-blue-button">Convert to Row</a>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }
}
