// Libraries
import React from 'react';
import { connect } from 'react-redux';
import { CustomNavigationBar } from 'app/core/components/CustomNav';
import { Playlists } from './Playlists';
import { ManageTab } from './ManageTab';

// Services & Utils
export interface Props {
  $scope: any;
  $injector: any;
  location: any;
}

class ManageDashboards extends React.Component<any, any> {
  breadCrumbs: any = [
    {
      label: 'Home',
      route: `/`,
    },
    {
      label: 'Manage Dashboards',
      isCurrentPage: true,
    },
  ];
  constructor(props: Props) {
    super(props);
    this.state = {
      activeTab: 0,
    };
  }

  setActiveTab = (activeTab: any) => {
    this.setState({
      activeTab,
    });
  };
  render() {
    const breadCrumbs = this.breadCrumbs;
    const pageTitle = 'MANAGE DASHBOARDS';
    const { activeTab } = this.state;
    return (
      <React.Fragment>
        <CustomNavigationBar />
        <div className="dashboard monitor-main-body">
          <div className="breadcrumbs-container">
            {pageTitle && <div className="page-title">{pageTitle}</div>}
            <div className="breadcrumbs">
              {breadCrumbs.map((breadcrumb: any, index: any) => {
                if (breadcrumb.isCurrentPage) {
                  return (
                    <span key={index} className="current-page">
                      {breadcrumb.label}
                    </span>
                  );
                } else {
                  return (
                    <React.Fragment key={index}>
                      <a href={`${breadcrumb.route}`} className="breadcrumbs-link">
                        {breadcrumb.label}
                      </a>
                      <span className="separator">
                        <i className="fa fa-chevron-right"></i>
                      </span>
                    </React.Fragment>
                  );
                }
              })}
            </div>
          </div>
          <div className="perfmanager-page-container">
            <div className="common-container border-bottom-0">
              <div className="manage-dashboard-heading">
                <div className="heading-icon">
                  <img src="/public/img/dashboard-icon.png" alt="" />
                </div>
                <div className="heading-right">
                  <h3>Dashboards</h3>
                  <p>Manage dashboards &amp; folders</p>
                </div>
              </div>
              <div className="manage-dashboard-radio-btns">
                <ul>
                  <li>
                    <input type="radio" id="f-kpi" name="selector" />
                    <label htmlFor="f-kpi">KPI</label>
                  </li>
                  <li>
                    <input type="radio" id="f-log" name="selector" />
                    <label htmlFor="f-v">Log</label>
                  </li>
                  <li>
                    <input type="radio" id="f-schema" name="selector" />
                    <label htmlFor="f-schema">Schema</label>
                  </li>
                </ul>
              </div>
              <div className="manage-dashboard-tabs">
                <ul>
                  <li className={activeTab === 0 ? 'active-tab' : ''} onClick={e => this.setActiveTab(0)}>
                    <a href="#">Manage</a>
                  </li>
                  <li className={activeTab === 1 ? 'active-tab' : ''} onClick={e => this.setActiveTab(1)}>
                    <a href="#">Playlist</a>
                  </li>
                  <li className={activeTab === 2 ? 'active-tab' : ''} onClick={e => this.setActiveTab(2)}>
                    <a href="#">Snapshots</a>
                  </li>
                </ul>
              </div>
              <div className="tab-container">
                {activeTab === 0 && <ManageTab />}
                {activeTab === 1 && <Playlists />}
                {activeTab === 2 && <div></div>}
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export const mapStateToProps = (state: any) => state;

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ManageDashboards);
